'use strict';

var Status = require('dw/system/Status');
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var Logger = require('dw/system/Logger');
var ISLogger = Logger.getLogger('InventorySync', 'InventorySync');

var ArrayList = require('dw/util/ArrayList');
var preSaleVariantArray = new ArrayList();

/**
 * Create file
 * @param {string} fileName - The file name
 * @returns {File} file object
 */
function createFile(fileName) {
    var catalogName = fileName;
    var targetFolder = new File(File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'inventory');

    if (!targetFolder.exists()) {
        ISLogger.info('Creating folder "{0}"', targetFolder.fullPath);
        targetFolder.mkdirs();
    }
    var fileWriter = new FileWriter(new File(targetFolder.fullPath + File.SEPARATOR + catalogName), 'UTF-8');

    return fileWriter;
}

/**
 * Write inventory xml record
 * @param {File} fw - The file name
 * @param {string} productID - Product ID
 * @param {number} allocation - Allocation
 * @param {boolean} preorder - Pre-order
 */
function writeInventoryRecord(fw, productID, allocation, preorder) { // eslint-disable-line
    fw.writeLine('<record product-id="' + productID + '">');
    fw.writeLine('    <allocation>' + allocation + '</allocation>');
    if (preorder === true) {
        fw.writeLine('    <preorder-backorder-handling>preorder</preorder-backorder-handling>');
        fw.writeLine('    <preorder-backorder-allocation>999.0</preorder-backorder-allocation>');
        fw.writeLine('    <in-stock-date>2099-01-01Z</in-stock-date>');
        fw.writeLine('    <in-stock-datetime>2099-01-01T06:00:00.000Z</in-stock-datetime>');
    }
    fw.writeLine('</record>');
}

/**
 * Write inventory xml start
 * @param {File} fw - The file name
 * @param {string} siteInventoryID - Product ID
 */
function writeInventoryStart(fw, siteInventoryID) { // eslint-disable-line
    fw.writeLine('<?xml version="1.0" encoding="UTF-8"?>');
    fw.writeLine('<inventory xmlns="http://www.demandware.com/xml/impex/inventory/2007-05-31">');
    fw.writeLine('    <inventory-list>');
    fw.writeLine('        <header list-id="' + siteInventoryID + '">');
    fw.writeLine('            <default-instock>false</default-instock>');
    fw.writeLine('            <description>Inventory list</description>');
    fw.writeLine('            <use-bundle-inventory-only>false</use-bundle-inventory-only>');
    fw.writeLine('            <on-order>false</on-order>');
    fw.writeLine('        </header>');
    fw.writeLine('        <records>');
}

/**
 * Write inventory xml end
 * @param {File} fw - The file name
 * @param {string} productID - Product ID
 */
function writeInventoryEnd(fw) { // eslint-disable-line
    fw.writeLine('        </records>');
    fw.writeLine('    </inventory-list>');
    fw.writeLine('</inventory>');
}

/**
 * Get preSaleOverSaleEnabled from master product
 * @param {string} sku - sku
 * @returns {boolean} is the master preSaleOverSaleEnabled
 */
function isPreSaleOverSale(sku) {
    if (preSaleVariantArray.indexOf(sku) !== -1) {
        return true;
    }
    return false;
}

/**
 * New local service instance
 * @returns {dw.svc.LocalServiceRegistry} LocalServiceRegistry
 */
function newService() {
    var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

    return LocalServiceRegistry.createService("shipstation", {
        createRequest: function (svc) {
            var Site = require('dw/system/Site');
            var apiKey = Site.current.getCustomPreferenceValue('shipStationApiKey');

            if (empty(apiKey)) {
                Logger.error('shipStationInventory - Site Preference "shipStationApiKey" is empty');
            }

            svc.addHeader('api-key', apiKey);
            svc.setRequestMethod('GET');
        },
        parseResponse: function (svc, client) {
            return client.text;
        },
        filterLogMessage: function (msg) {
            //  No need to filter logs.  No sensitive information.
            return msg;
        }
    });
}

/**
 * Retrieve first page
 * @returns {string} json data
 */
function firstPage() {
    var service = newService();
    service.setURL(service.URL + '/v2/inventory');
    service.addParam('page_size', 500); // 500
    var result = service.call();

    if (result.status === 'OK') {
        if (!empty(result.object)) {
            try {
                return JSON.parse(result.object);
            } catch(e) {
                Logger.error('shipStationInventory - Error parsing data = {0}', e);
            }
        }
    } else {
        Logger.error('shipStationInventory - firstPage\nresult.status = {0}\nresult.text = {1}', result.status, result.text);
    }

    return '';
}

/**
 * Retrieve first page
 * @param {string} cursor - query string cursor reference for next page
 * @returns {string} json data
 */
function nextPage(cursor) {
    var service = newService();
    service.setURL(service.URL + '/v2/inventory' + '?cursor=' + cursor);
    service.addParam('page_size', 500); // 500
    var result = service.call();

    if (result.status === 'OK') {
        if (!empty(result.object)) {
            try {
                return JSON.parse(result.object);
            } catch(e) {
                Logger.error('shipStationInventory - Error parsing data = {0}', e);
            }
        }
    } else {
        Logger.error('shipStationInventory - nextPage\nresult.status = {0}\nresult.text = {1}', result.status, result.text);
    }

    return '';
}

/**
 * Write zeros for all SKUs
 * @param {dw.io.FileWriter} fw - file writer
 * @param {string} storefrontCatalogID - product catalog ID
 */
function zeroInventory(fw, storefrontCatalogID) {
    var CatalogMgr = require('dw/catalog/CatalogMgr');
    var ProductMgr = require('dw/catalog/ProductMgr');

    var catalog = CatalogMgr.getCatalog(storefrontCatalogID);
    var si = ProductMgr.queryProductsInCatalog(catalog); // Get all products regardless of online

    ISLogger.info('zeroInventory: All products count "{0}"', si.getCount());

    var outputCount = 0;
    if (si.getCount()) {
        // Loop through products
        while (si.hasNext()) {
            var product = si.next();
            // master, variant, bundle, productSet, productSetProduct, bundled
            if (product.variant || product.product === true && product.master === false && product.variant === false) { // Only variants
                var preSaleOverSaleEnabled = false;
                var master = product.variationModel.master;
                if (!empty(master) && (master.custom.preSaleOverSaleEnabled === true)) {
                    preSaleVariantArray.add(product.ID);
                    preSaleOverSaleEnabled = true;
                    ISLogger.info('Presale: Master "{0}" / SKU "{1}"', master.ID, product.ID);
                }
                writeInventoryRecord(fw, product.ID, 0, preSaleOverSaleEnabled); // Zero the inventory
                outputCount++;
            }
        }
    }

    ISLogger.info('zeroInventory: Wrote "{0}" records', outputCount);
}

/**
 * Run code
 * @param {Object} args - Arguments
 * @returns {Status} status object
 */
function execute(args) {
    if (args.IsDisabled) {
        return new Status(Status.OK, 'OK', 'Step disabled, skipping...');
    }

    var storefrontCatalogID = 'yd-categories';
    storefrontCatalogID = !empty(args.StorefrontCatalogID) ? args.StorefrontCatalogID : storefrontCatalogID;

    var siteInventoryID = 'yd-inventory';
    siteInventoryID = !empty(args.SiteInventoryID) ? args.SiteInventoryID : siteInventoryID;

    var inventoryFileName = 'yd-inventory.xml';
    inventoryFileName = !empty(args.InventoryFileName) ? args.InventoryFileName : inventoryFileName;

    ISLogger.info('storefrontCatalogID: "{0}"', storefrontCatalogID);
    ISLogger.info('siteInventoryID: "{0}"', siteInventoryID);
    ISLogger.info('inventoryFileName: "{0}"', inventoryFileName);

    var fw;
    var data = firstPage();
    if (!empty(data)) {
        var outputCount = 0;

        fw = createFile(inventoryFileName);
        writeInventoryStart(fw, siteInventoryID);

        if (data.inventory !== undefined && data.inventory.length) {
            zeroInventory(fw, storefrontCatalogID);

            ISLogger.info('Page {1} of {2} - Total: {0}', data.total, data.page, data.pages);

            // Write page 1 records
            var i;
            for (i = 0; i < data.inventory.length; i++) {
                writeInventoryRecord(fw, data.inventory[i].sku, data.inventory[i].available, isPreSaleOverSale(data.inventory[i].sku));
                outputCount++;
            }

            // Loop number of pages
            var page = data.page;
            var maxPage = data.pages;
            for (var p = page; p <= maxPage; p++) {
                var cursor = '';
                if (data.links !== undefined && data.links.next !== undefined && data.links.next.href !== undefined) {
                    var next = data.links.next.href;
                    if (!empty(next)) {
                        cursor = next.slice(next.indexOf('cursor=')+7);
                    }
                }

                if (!empty(cursor)) {
                    data = nextPage(cursor);
                    if (!empty(data)) {
                        ISLogger.info('Page {1} of {2} - Total: {0}', data.total, data.page, data.pages);

                        // Write page X records
                        if (data.inventory !== undefined && data.inventory.length) {
                            for (i = 0; i < data.inventory.length; i++) {
                                writeInventoryRecord(fw, data.inventory[i].sku, data.inventory[i].available, isPreSaleOverSale(data.inventory[i].sku));
                                outputCount++;
                            }
                        } else {
                            p = maxPage; // Stop loop
                        }
                    } else {
                        p = maxPage; // Stop loop
                    }
                } else {
                    p = maxPage; // Stop loop
                }
            }
        }

        writeInventoryEnd(fw);

        ISLogger.info('Wrote "{0}" records. Done!', outputCount);
    } else {
        ISLogger.info('No results...');
        return new Status(Status.OK, 'WARN', 'No results...');
    }

    /*
    */

    if (!empty(fw)) {
        fw.close();
    }

    // ------------------------------
    // Next step is to import the inventory file
    // ------------------------------

    return new Status(Status.OK);
}

module.exports = {
    execute: execute
};
