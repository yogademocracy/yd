'use strict';

var xmlWriteHelpers = require('*/cartridge/scripts/helpers/xmlGiftCertificatesWriteHelpers');



/**
 * Writes custom attributes in xml file
 *
 * @param {dw.io.XMLStreamWriter} xsw - XML stream writer
 */
function writeCustomAttributes(xsw) {
    xsw.writeStartElement('custom-attributes');

    xmlWriteHelpers.writeCustomAttribute(xsw, 'isLegacy', 'true');

    xsw.writeEndElement();
}

/**
 * Writes system attributes in xml file
 *
 * @param {dw.io.XMLStreamWriter} xsw - XML stream writer
 * @param {object} record - attributes object from file
 * @param {object} columnIndexes - indexes of columns from file
 */
function writeSystemAttributes(xsw, record) {
    if (record.createDate) {
        xmlWriteHelpers.writeXMLElement(xsw, 'create-date', record.createDate);
    }

    if (record.customerName) {
        xmlWriteHelpers.writeXMLElement(xsw, 'recipient-name', record.customerName);
    }

    if (record.email) {
        xmlWriteHelpers.writeXMLElement(xsw, 'recipient-email', record.email);
    }

    if (record.sender) {
        xmlWriteHelpers.writeXMLElement(xsw, 'sender-name', record.sender);
    }

    if (record.message) {
        xmlWriteHelpers.writeXMLElement(xsw, 'message', record.message);
    }

    if (record.note) {
        xmlWriteHelpers.writeXMLElement(xsw, 'description', record.note);
    }

    xmlWriteHelpers.writeXMLElement(xsw, 'order-no', 'Business Manager');

    if (record.enabled) {
        xmlWriteHelpers.writeXMLElement(xsw, 'enabled-flag', record.enabled);
    }

    if (record.status) {
        xmlWriteHelpers.writeXMLElement(xsw, 'status', record.status);
    }

    if (record.currency) {
        xmlWriteHelpers.writeXMLElement(xsw, 'currency', record.currency);
    }

    // if (record.amount) {
    //     xmlWriteHelpers.writeXMLElement(xsw, 'amount', record.amount);
    // }

    if (record.balance) {
        xmlWriteHelpers.writeXMLElement(xsw, 'amount', record.balance);
    }

    // if (record.balance) {
    //     // xmlWriteHelpers.writeXMLElement(xsw, 'balance', record.balance);
    //     xsw.writeStartElement('redemptions');
    //     xsw.writeStartElement('redemption');

    //     // <redeem-date>2025-07-30T15:30:00.000Z</redeem-date>
    //     // <redeem-amount>20.00</redeem-amount>
    //     // <order-no>00012345</order-no>
    //     xmlWriteHelpers.writeXMLElement(xsw, 'date', '2025-07-30T15:30:00.000Z');
    //     xmlWriteHelpers.writeXMLElement(xsw, 'amount', '20.00');
    //     xmlWriteHelpers.writeXMLElement(xsw, 'order-no', '00012345');


    //     xsw.writeEndElement();
    //     xsw.writeEndElement();
    // }
}

/**
 * Writes Gift Certificate in xml
 *
 * @param {dw.io.XMLStreamWriter} xsw - XML stream writer
 * @param {object} record - attributes object from file
 * @returns {void}
 */
function writeGiftCertificate(xsw, record) {
    var Logger = require('dw/system/Logger').getLogger('gs_import');

    xsw.writeStartElement('gift-certificate');
    xsw.writeAttribute('gc-id', record.id);

    writeSystemAttributes(xsw, record);
    writeCustomAttributes(xsw);

    xsw.writeEndElement();

    Logger.info('Gift Certificate with id {0} successfully wrote', record.id);
}

/**
 * Writes header xml file
 *
 * @param {dw.io.XMLStreamWriter} xsw - XML stream writer
 */
function writeHeader(xsw) {
    xsw.writeStartDocument('UTF-8', '1.0');
    xsw.writeStartElement('gift-certificates');
    xsw.writeDefaultNamespace('http://www.demandware.com/xml/impex/giftcertificate/2007-02-28');
}

module.exports = {
    writeHeader: writeHeader,
    writeGiftCertificate: writeGiftCertificate
};
