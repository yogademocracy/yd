'use strict';

/**
 * Get content from content asset
 * 
 * @param {string} contentId - The content asset id
 * @param {Object} params - The set of placeholders to replace
 * @returns {string} - content from custom body attribute
 */
function getContentById(contentId, params) {
    var contentLogger = require('dw/system/Logger').getLogger('Content', 'Content');
    var ContentMgr = require('dw/content/ContentMgr');
    var apiContent = ContentMgr.getContent(contentId);

    if (!apiContent || !apiContent.online) {
        contentLogger.warn('Content asset with ID {0} was either not found or offline', contentId);
        return '';
    }

    var content = apiContent.custom.body.toString();

    if (params) {
        Object.keys(params).forEach(function (key) {
            content = content.replace('${' + key + '}', params[key], 'g');
        });
    }

    return content;
}

/**
 * Sends message for gift certificate email
 * 
 * @param {object} giftCertificateBM - gift Certificate BM object
 * @returns {string} message
 */
function getEmailMessage(giftCertificateBM) {
    var giftCertificate = giftCertificateBM.GiftCertificate;

    var giftCertificateObj = {
        id: giftCertificate.ID,
        customerName: giftCertificate.recipientName,
        balance: giftCertificate.balance ? giftCertificate.balance.value : 0
    };

    var message = getContentById('email-gift-certificate-created', giftCertificateObj);

    return message;
};

module.exports = {
    getEmailMessage: getEmailMessage
};
