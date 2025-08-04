'use strict';

/**
 * Write xml element
 *
 * @param {dw.io.XMLStreamWriter} xsw - XML stream writer
 * @param {string} startElement - name of start element
 * @param {string} characters - value in tag
 * @param {Array} attributes - optional parameter for write attributes. Must contain objects that have properties name and value
 */
function writeXMLElement(xsw, startElement, characters, attributes) {
    xsw.writeStartElement(startElement);

    if (attributes) {
        attributes.forEach(function (attribute) {
            xsw.writeAttribute(attribute.name, attribute.value);
        });
    }

    xsw.writeCharacters(characters);
    xsw.writeEndElement();
}

/**
 * Write custom xml element
 *
 * @param {dw.io.XMLStreamWriter} xsw - XML stream writer
 * @param {string} attributeValue - value for attribute-id
 * @param {string} characters - value in tag
 * @param {string} locale - request locale
 */
function writeCustomAttribute(xsw, attributeValue, characters, locale) {
    xsw.writeStartElement('custom-attribute');

    xsw.writeAttribute('attribute-id', attributeValue);

    if (locale) {
        xsw.writeAttribute('xml:lang', locale);
    }

    xsw.writeCharacters(characters);
    xsw.writeEndElement();
}

/**
 * Write custom properties of object
 *
 * @param {dw.io.XMLStreamWriter} xsw - XML stream writer
 * @param {dw.object.CustomAttributes} customObject - The object whose properties you want to write
 */
function writeCustomProperties(xsw, customObject) {
    xsw.writeStartElement('custom-attributes');

    Object.keys(customObject).forEach(function (key) {
        if (customObject[key] instanceof Array) {
            xsw.writeStartElement('custom-attribute');
            xsw.writeAttribute('attribute-id', key);

            for (var i = 0; i < customObject[key].length; i++) {
                writeXMLElement(xsw, 'value', customObject[key][i]);
            }

            xsw.writeEndElement();
        } else if (customObject[key] || customObject[key] === 0) {
            writeCustomAttribute(xsw, key, customObject[key]);
        }
    });
    xsw.writeEndElement();
}

/**
 * Map column indexes
 *
 * @param {Array} header - name of columns
 * @param {object} columns - includes required column names for recording xml of store
 * @returns {object} of key and appropriate column indexes
 */
function mappingHeader(header, columns) {
    var columnsName = Object.keys(columns);
    var mapping = {};

    header.forEach(function (el, i) {
        if (columnsName.indexOf(el) >= 0) {
            mapping[columns[el]] = i;
        }
    });

    return Object.keys(mapping).length === 0 ? null : mapping;
}

/**
 * Creates object from column
 *
 * @param {Array} record - row attributes from file
 * @param {object} columnIndexes - indexes of columns from file
 * @returns {object} object from column
 */
function createsColumObject(record, columnIndexes) {
    var recordObj = {};

    Object.keys(columnIndexes).forEach(function (key) {
        recordObj[key] = record[columnIndexes[key]];
    });

    return recordObj;
}

/**
 * Write end document and close XML stream writer
 *
 * @param {dw.io.XMLStreamWriter} xsw - XML stream writer
 */
function endXmlDocument(xsw) {
    xsw.writeEndDocument();
    xsw.close();
}

module.exports = {
    writeCustomAttribute: writeCustomAttribute,
    writeXMLElement: writeXMLElement,
    mappingHeader: mappingHeader,
    createsColumObject: createsColumObject,
    endXmlDocument: endXmlDocument,
    writeCustomProperties: writeCustomProperties
};
