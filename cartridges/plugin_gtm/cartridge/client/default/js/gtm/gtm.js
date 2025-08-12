'use strict';

/**
 * Init GTM script
 * @param {string} gtmContainerId - GTM container ID
 */
function initGTM(gtmContainerId) {
    const w = window;
    const d = document;
    const s = 'script';
    const l = 'dataLayer';
    const i = gtmContainerId;

    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s);
    const dl = l !== 'dataLayer' ? `&l=${l}` : '';

    j.async = true;
    j.src = `https://www.googletagmanager.com/gtm.js?id=${i + dl}`;
    f.parentNode.insertBefore(j, f);
}

/**
 * Main handling function
 */
function handleGTM() {
    const $gtmContainer = $('.gtm-container');
    const gtmOptions = $gtmContainer.data('gtm-option');

    if (!gtmOptions || !gtmOptions.gtmEnabled || !gtmOptions.gtmContainerId) {
        return;
    }

    initGTM(gtmOptions.gtmContainerId);
}

module.exports = {
    handleGTM
};
