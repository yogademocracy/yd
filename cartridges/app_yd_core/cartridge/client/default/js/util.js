'use strict';

var util = {
    /**
     * Sets cookies
     * @param {Object} cookies - cookies
     * @param {string} exdays - expire days
     */
    setCookies: function (cookies, exdays) {
        var exseconds = exdays*24*60*60;

        cookies.forEach(function(cookie) {
            util.setCookie(cookie.name, cookie.value, {expires: exseconds});
        });
    },

    /**
     *  Set cookie by name
     *  @param {string} name of cookie
     *  @param {string} value of cookie
     *  @param {Object} options options
     */
    setCookie: function(name, value, options) {
        options = options || {};

        options.path = options.path || '/';

        var expires = options.expires;

        if (typeof expires === "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value + ';secure';

        for (var propName in options) {
            if (!options.hasOwnProperty(propName)) {
                continue;
            }
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    },
    /**
     * get cookie by name
     * @param {string} name of cookie
     * @returns cookie value or undefined
     */
    getCookie: function(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    },
};

module.exports = util;
