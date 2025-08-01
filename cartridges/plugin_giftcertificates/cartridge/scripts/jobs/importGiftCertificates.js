'use strict';

var File = require('dw/io/File');
var CSVStreamReader = require('dw/io/CSVStreamReader');
var XMLStreamWriter = require('dw/io/XMLStreamWriter');
var FileReader = require('dw/io/FileReader');
var FileWriter = require('dw/io/FileWriter');
var StringUtils = require('dw/util/StringUtils');
var Calendar = require('dw/util/Calendar');
var Status = require('dw/system/Status');
var Logger = require('dw/system/Logger').getLogger('gs_import');

var COLUMNS_NAME_RAW = {
    createDate: 'Date Issued',
    sender: 'Issuing Staff Member',
    message: 'Message',
    note: 'Note',
    id: 'Id',
    customerName: 'Customer Name',
    email: 'Email',
    amount: 'Initial Balance',
    balance: 'Current Balance',
    currency: 'Currency',
    expired: 'Expired?',
    enabled: 'Enabled?'
};

// Reverse keys and values in COLUMNS_NAME_RAW
var COLUMNS_NAME = Object.keys(COLUMNS_NAME_RAW).reduce(function (acc, el) {
    acc[COLUMNS_NAME_RAW[el]] = el;

    return acc;
}, {});

/**
 * Move file from one folder to another
 *
 * @param {dw.io.File} fileOrig -  file  to move
 * @param {string} targetFolder - the folder where to move source file
 * @param {string} targetFileName - target file name
 */
function moveFileTo(fileOrig, targetFolder, targetFileName) {
    var archiveFolder = new File(targetFolder);

    if (!archiveFolder.exists()) {
        archiveFolder.mkdirs();
    }

    var archiveFile = new File(archiveFolder.fullPath + File.SEPARATOR + targetFileName);

    fileOrig.copyTo(archiveFile);
    fileOrig.remove();
    Logger.info('{0} moved to {1}', fileOrig.name, archiveFile.fullPath);
}

/**
 * Modify values in record
 *
 * @param {Array} record - row of store attributes from file
 * @param {object} columnIndexes - indexes of columns from file
 * @returns {Array} modified record
 */
function processRecord(record, columnIndexes) {
    var modifiedRecord = record;

    if (columnIndexes.expired && record[columnIndexes.expired] === 'true') {
        modifiedRecord[columnIndexes.enabled] = 'false';
    }

    if (columnIndexes.createDate && !empty(record[columnIndexes.createDate])) {
        var creationDate = new Date(record[columnIndexes.createDate]);
        var formattedDate = StringUtils.formatCalendar(new Calendar(creationDate), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
        modifiedRecord[columnIndexes.createDate] = formattedDate;
    }

    return modifiedRecord;
}

/**
 * Gets status for Gift Certificate
 *
 * @param {object} record - attributes object from file
 */
function getStatus(record) {
    // var amount = record.amount ? parseInt(record.amount, 10) : 0;
    var balance = record.balance ? parseInt(record.balance, 10) : 0;

    if (empty(record.email)) {
        return 'PENDING';
    }

    if (balance === 0) {
        return 'REDEEMED';
    }

    // if (amount !== balance) {
    //     return 'PART_REDEEMED';
    // }

    // if (amount === balance) {
    //     return 'ISSUED';
    // }

    return 'ISSUED';
}

/**
 * Generates XML for Gift Certificates
 *
 * @param {dw.util.HashMap} params job arguments
 * @param {string} params.sourceFolder - source folder to take the file
 * @param {string} params.targetFolder - target folder to place XMLs
 * @param {string} params.fileNamePattern - regular expression pattern to select import files
 * @returns {dw.system.Status} status of process
 */
function execute(params) {
    if (params.IsDisabled) {
        return new Status(Status.OK, 'OK', 'Step disabled, skipping...');
    }

    var xmlGiftCertificatesHelpers = require('*/cartridge/scripts/helpers/xmlGiftCertificatesHelpers');
    var xmlWriteHelpers = require('*/cartridge/scripts/helpers/xmlGiftCertificatesWriteHelpers');
    var giftCertificatesHelpers = require('*/cartridge/scripts/helpers/giftCertificatesHelpers');

    var filePattern = new RegExp(params.fileNamePattern);
    var folder = new File(File.IMPEX + File.SEPARATOR + params.sourceFolder);

    var listFiles = folder.listFiles(function (file) {
        return filePattern.test(file.name) && !file.isDirectory();
    });

    if (!listFiles) {
        return new Status(Status.ERROR, 'ERROR', 'ERROR: Invalid source folder path');
    } else if (listFiles.length === 0) {
        return new Status(Status.OK, 'NO_FILES_FOUND', 'NO_FILES_FOUND: 0 was processed.');
    }

    for (var i = 0; i < listFiles.length; i++) {
        var file = listFiles[i];

        var timestamp = StringUtils.formatCalendar(new Calendar(), 'yyyy-MM-dd-HH-mm-ss');
        var xmlName = 'gcImport_' + file.name + '_' + timestamp + '.xml';

        var fileReader = new FileReader(file);
        var csr = new CSVStreamReader(fileReader);
        var targetFolder = new File(File.IMPEX + File.SEPARATOR + params.targetFolder);

        if (!targetFolder.exists()) {
            targetFolder.mkdirs();
        }

        var fileWriter = new FileWriter(new File(targetFolder.fullPath + File.SEPARATOR + xmlName), 'UTF-8');
        var xsw = new XMLStreamWriter(fileWriter);

        var record = csr.readNext();

        if (record) {
            var columnIndexes = xmlWriteHelpers.mappingHeader(record, COLUMNS_NAME);
            var gcCount = 0;

            if (!columnIndexes) {
                return new Status(Status.ERROR, 'ERROR', 'ERROR: Incorrectly written file header');
            }

            record = csr.readNext();
            xmlGiftCertificatesHelpers.writeHeader(xsw);

            while (record) {
                record = processRecord(record, columnIndexes);
                record = xmlWriteHelpers.createsColumObject(record, columnIndexes);
                record.status = getStatus(record);

                xmlGiftCertificatesHelpers.writeGiftCertificate(xsw, record);

                if (!empty(record.email) && record.status === 'ISSUED' && record.enabled === 'true') {
                    giftCertificatesHelpers.sendEmail(record);
                }

                record = csr.readNext();
                gcCount++;
            }

            Logger.info('{0} Gift Certificates were processed and recorded', gcCount);
        }

        xmlWriteHelpers.endXmlDocument(xsw);

        moveFileTo(file, folder.fullPath + File.SEPARATOR + 'archive', 'archive-' + timestamp + '-' + file.name);

        fileWriter.close();
        csr.close();
        fileReader.close();
    }

    return new Status(Status.OK);
}

module.exports = {
    execute: execute
};
