/**
 * SLDS Color Picker
 */
(() => {
    /** The main Editor element to be tinkered with */
    var rootEditorElement;
    /** The main Editor element to be tinkered with */
    var currentHSV;
    /** the list of colors */
    const colorsArray = [
        {
            name: 'Blush Pink',
            hex: '#e3abec'
        },
        {
            name: 'Tropical Blue',
            hex: '#c2dbf7'
        },
        {
            name: 'Baby Blue',
            hex: '#9fd6ff'
        },
        {
            name: 'Water Leaf',
            hex: '#9de7da'
        },
        {
            name: 'Magic Mint',
            hex: '#9df0c0'
        },
        {
            name: 'Buff Yellow',
            hex: '#fff099'
        },
        {
            name: 'Maize',
            hex: '#fed49a'
        },
        {
            name: 'Orchid',
            hex: '#d073e0'
        },
        {
            name: 'Jordy Blue',
            hex: '#86baf3'
        },
        {
            name: 'Crystal Blue',
            hex: '#5ebbff'
        },
        {
            name: 'Medium Turquoise',
            hex: '#44d8be'
        },
        {
            name: 'Aqua Green',
            hex: '#3be282'
        },
        {
            name: 'Yellow Tan',
            hex: '#ffe654'
        },
        {
            name: 'Texas Rose',
            hex: '#ffb758'
        },
        {
            name: 'Medium Orchid',
            hex: '#bd35bd'
        },
        {
            name: 'Tealish Blue',
            hex: '#5779c1'
        },
        {
            name: 'Cerulean',
            hex: '#00a1e0'
        },
        {
            name: 'Persian Green',
            hex: '#00aea9'
        },
        {
            name: 'Leafy Green',
            hex: '#3cba4c'
        },
        {
            name: 'Orangey Yellow',
            hex: '#f5bc25'
        },
        {
            name: 'Carrot Orange',
            hex: '#f99221'
        },
        {
            name: 'Purple Iris',
            hex: '#580d8c'
        },
        {
            name: 'Deep Sapphire',
            hex: '#001970'
        },
        {
            name: 'Royal Blue',
            hex: '#0a2399'
        },
        {
            name: 'Surfie Green',
            hex: '#0b7477'
        },
        {
            name: 'Medium Forest Green',
            hex: '#41693d'
        },
        {
            name: 'Pirate Gold',
            hex: '#b67e11'
        },
        {
            name: 'Pumpkin Skin',
            hex: '#b85d0d'
        },
        {
            name: 'White',
            hex: '#FFFFFF'
        },
        {
            name: 'Lightest Grey',
            hex: '#DDDDDD'
        },
        {
            name: 'Light Grey',
            hex: '#BBBBBB'
        },
        {
            name: 'Medium Grey',
            hex: '#999999'
        },
        {
            name: 'Dark Grey',
            hex: '#666666'
        },
        {
            name: 'Darkest Grey',
            hex: '#333333'
        },
        {
            name: 'Black',
            hex: '#000000'
        }
    ]

    /**
     * Generates the selection of colors privided by the color picker
     */
    function generateColorsHTML(obj) {
        var markup = '';
        Object.keys(obj).forEach(function (key) {
            markup += '<li class="slds-color-picker__swatch" role="presentation">'
                + '<a class="slds-color-picker__swatch-trigger" title="' + obj[key].name + '" href="#" role="option" tabindex="-1">'
                + '<span class="slds-swatch" style="background:' + obj[key].hex + '">'
                + '<span class="slds-assistive-text">' + obj[key].hex + '</span>'
                + '</span>'
                + '</a>'
                + '</li>'
        })
        return markup;
    }

    /**
     * Generates the selected color display value, if there is a selected color
     */
    function getSelectedValue(colorObj, val) {
        var value = '';
        if (val === null) {
            return value;
        }

        Object.keys(colorObj).forEach(function (key) {
            if (colorObj[key].hex === val.value) {
                value = colorObj[key].name;
            }
        })

        if (value.length < 1) {
            value = val.value;
        }

        return value;
    }

    /**
     * initializes the base markup before page is ready. This is not part of the API, and called explicitely at the end of this module.
     */
    function init() {
        rootEditorElement = document.createElement('div');
        rootEditorElement.innerHTML = `
    <div class="slds-color-picker">
    <div class="slds-form-element slds-color-picker__summary">
        <div class="slds-form-element__control">
            <button class="slds-button slds-color-picker__summary-button slds-button_icon slds-button_icon-more" title="Choose Color">
                <span class="slds-swatch" style="background:hsl(220, 46%, 55%)">
                    <span class="slds-assistive-text">hsl(220, 46%, 55%)</span>
                </span>
                <svg class="slds-button__icon slds-button__icon_small slds-m-left_xx-small" aria-hidden="true" viewBox="0 0 24 24" >
                    <path d="M3.8 6.5h16.4c.4 0 .8.6.4 1l-8 9.8c-.3.3-.9.3-1.2 0l-8-9.8c-.4-.4-.1-1 .4-1z"></path>
                </svg>
            <span class="slds-assistive-text">Choose a color. Current color: #5679C0</span>
</button>
        <div class="slds-color-picker__summary-input">
            <input type="hidden" id="color-picker-summary-input" class="slds-input" value="#5679C0" />
            <input type="text" id="color-picker-summary-input-display" disabled="disabled" class="slds-input" value="#5679C0" />
        </div>
    </div>
</div>
    <section aria-describedby="dialog-body-id-9" aria-label="Choose a color" class="slds-popover slds-color-picker__selector slds-hide" role="dialog">
        <div class="slds-popover__body" id="dialog-body-id-9">
            <div class="slds-tabs_default">
                <ul class="slds-tabs_default__nav" role="tablist">
                    <li class="slds-tabs_default__item colorpicker-default-tab slds-is-active" title="Default" role="presentation">
                        <a class="slds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="color-picker-default" id="color-picker-default__item">Default</a>
                    </li>
                    <li class="slds-tabs_default__item colorpicker-custom-tab" title="Custom" role="presentation">
                        <a class="slds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="color-picker-custom" id="color-picker-custom__item">Custom</a>
                    </li>
                </ul>
                <div id="color-picker-default" class="slds-tabs_default__content slds-show" role="tabpanel" aria-labelledby="color-picker-default__item">
                    <ul class="slds-color-picker__swatches" role="listbox" id="colorsArray">

                    </ul>
                </div>
                <div id="color-picker-custom" class="slds-tabs_default__content slds-hide" role="tabpanel" aria-labelledby="color-picker-custom__item">
                    <div class="slds-color-picker__custom">
                        <p id="color-picker-instructions" class="slds-assistive-text">Use arrow keys to select a saturation and brightness, on an x and y axis.</p>
                        <div class="slds-color-picker__custom-range" style="background:hsl(220, 100%, 50%)">
                            <a class="slds-color-picker__range-indicator" style="bottom:45%;left:46%" href="#" aria-live="assertive" aria-atomic="true" aria-describedby="color-picker-instructions" draggable="true">
                                <span class="slds-assistive-text">Saturation: 46%. Brightness: 45%.</span>
                            </a>
                        </div>
                        <div class="slds-color-picker__hue-and-preview">
                            <label class="slds-assistive-text" for="color-picker-input-range-9">Select Hue</label>
                            <input type="range" class="slds-color-picker__hue-slider" min="0" max="360" id="color-picker-input-range-9" value="208" />
                            <span class="slds-swatch" style="background:#5679C0">
                                <span class="slds-assistive-text display-selected-value" aria-hidden="true"></span>
                            </span>
                        </div>
                        <div class="slds-color-picker__custom-inputs">
                            <div class="slds-form-element slds-color-picker__input-custom-hex">
                                <label class="slds-form-element__label" for="color-picker-input-hex-9">Hex</label>
                                <div class="slds-form-element__control">
                                    <input type="text" id="color-picker-input-hex-9" class="slds-input" value="#5679C0" />
                                </div>
                            </div>
                            <div class="slds-form-element">
                                <label class="slds-form-element__label" for="color-picker-input-r-9">
                                    <abbr title="Red">R</abbr>
                                </label>
                                <div class="slds-form-element__control">
                                    <input type="text" id="color-picker-input-r-9" disabled="true" class="slds-input" value="86" />
                                </div>
                            </div>
                            <div class="slds-form-element">
                                <label class="slds-form-element__label" for="color-picker-input-g-9">
                                    <abbr title="Green">G</abbr>
                                </label>
                                <div class="slds-form-element__control">
                                    <input type="text" id="color-picker-input-g-9" disabled="true" class="slds-input" value="121" />
                                </div>
                            </div>
                            <div class="slds-form-element">
                                <label class="slds-form-element__label" disabled="true" for="color-picker-input-b-9">
                                    <abbr title="blue">B</abbr>
                                </label>
                                <div class="slds-form-element__control">
                                    <input type="text" id="color-picker-input-b-9" disabled="true" class="slds-input" value="192" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="slds-popover__footer">
            <div class="slds-color-picker__selector-footer">
                <button class="slds-button slds-button_neutral" id="cancel-button">Cancel</button>
                <button class="slds-button slds-button_brand" id="confirm-button">Done</button>
            </div>
        </footer>
    </section>
</div >`;
        // show "Loading.. "
        document.body.appendChild(rootEditorElement);

        var r = rootEditorElement.querySelector('#color-picker-input-r-9').value;
        var g = rootEditorElement.querySelector('#color-picker-input-g-9').value;
        var b = rootEditorElement.querySelector('#color-picker-input-b-9').value;
        currentHSV = ColorUtils.rgbToHsv({ r, g, b })
    };

    var ColorUtils = {
        /**
         * Converts an RGB color value to HSV. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
         * Assumes r, g, and b are contained in the set [0, 255] and
         * returns h, s, and v in the set [0, 1].
         *
         * @param   Number  r       The red color value
         * @param   Number  g       The green color value
         * @param   Number  b       The blue color value
         * @return  Array           The HSV representation
         */
        rgbToHsv: function rgbToHsv(rgb) {
            let r = rgb.r;
            let g = rgb.g;
            let b = rgb.b;
            r /= 255, g /= 255, b /= 255;

            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, v = max;

            var d = max - min;
            s = max == 0 ? 0 : d / max;

            if (max == min) {
                h = 0; // achromatic
            } else {
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }

                h /= 6;
            }

            return { h, s, v };
        },



        /**
         * Converts an HSV color value to RGB. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
         * Assumes h, s, and v are contained in the set [0, 1] and
         * returns r, g, and b in the set [0, 255].
         *
         * @param   Number  h       The hue
         * @param   Number  s       The saturation
         * @param   Number  v       The value
         * @return  Array           The RGB representation
         */
        hsvToRgb: function hsvToRgb(hsv) {
            let h = hsv.h;
            let s = hsv.s;
            let v = hsv.v;
            var r, g, b;

            var i = Math.floor(h * 6);
            var f = h * 6 - i;
            var p = v * (1 - s);
            var q = v * (1 - f * s);
            var t = v * (1 - (1 - f) * s);

            switch (i % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }

            return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
        },
        componentToHex: function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        },

        rgbToHex: function rgbToHex(rgb) {
            return "#" + this.componentToHex(rgb.r) + this.componentToHex(rgb.g) + this.componentToHex(rgb.b);
        }
    };

    function toggleColorPanelVisibility() {
        rootEditorElement.querySelector('.slds-color-picker__selector').classList.toggle("slds-hide");
        rootEditorElement.querySelector('.slds-color-picker__selector').classList.toggle("slds-show");
    }

    function switchElementsVisibility(selectorToHide, selectorToShow) {
        rootEditorElement.querySelector(selectorToHide).classList.add("slds-hide");
        rootEditorElement.querySelector(selectorToHide).classList.remove("slds-show");

        rootEditorElement.querySelector(selectorToShow).classList.add("slds-show");
        rootEditorElement.querySelector(selectorToShow).classList.remove("slds-hide");
    }

    function satLumHandler(event) {
        event.preventDefault();
        var saturation = event.layerX / event.currentTarget.offsetWidth;
        var value = 1 - (event.layerY / event.currentTarget.offsetHeight);
        rootEditorElement.querySelector('.slds-color-picker__range-indicator').style.left = saturation * 100 + '%';
        rootEditorElement.querySelector('.slds-color-picker__range-indicator').style.bottom = (value * 100) + '%';
        updateCustomUI({ s: saturation, v: value })
    }

    function hueHandler(event) {
        event.preventDefault();
        rootEditorElement.querySelector('.slds-color-picker__custom-range').style.background = `hsl(${event.currentTarget.value}, 100%, 50%)`;
        updateCustomUI({ h: event.currentTarget.value / 360 })
    }

    function updateCustomUI(updatedObject) {
        currentHSV = Object.assign(currentHSV, updatedObject);
        var rgb = ColorUtils.hsvToRgb(currentHSV);

        rootEditorElement.querySelector('#color-picker-input-r-9').value = rgb.r;
        rootEditorElement.querySelector('#color-picker-input-g-9').value = rgb.g;
        rootEditorElement.querySelector('#color-picker-input-b-9').value = rgb.b;
        var hex = ColorUtils.rgbToHex(rgb);
        rootEditorElement.querySelector('#color-picker-input-hex-9').value = hex;
        rootEditorElement.querySelector('#color-picker-custom .slds-swatch').style.backgroundColor = hex;
    }

    /** the page designer signals readiness to show this editor and provides an optionally pre selected value */
    listen('sfcc:ready', async ({ value, config, isDisabled, isRequired, dataLocale, displayLocale }) => {
        const selectedValue = typeof value === 'object' && value !== null && typeof value.value === 'string' ? value.value : null;

        const colors = typeof config === 'object' && 'options' in config && 'colors' in config.options && config.options.colors && config.options.colors.length ? config.options.colors : colorsArray;
        const selectedColorVal = getSelectedValue(colors, value);

        rootEditorElement.querySelector('#colorsArray').innerHTML = generateColorsHTML(colors);
        rootEditorElement.querySelector('#color-picker-summary-input-display').value = selectedColorVal;
        rootEditorElement.querySelector('#color-picker-input-hex-9').value = selectedColorVal;

        rootEditorElement.querySelector('.slds-color-picker__summary-button').addEventListener('click', toggleColorPanelVisibility);
        rootEditorElement.querySelector('.colorpicker-custom-tab').addEventListener('click', () => switchElementsVisibility('#color-picker-default', '#color-picker-custom'));
        rootEditorElement.querySelector('.colorpicker-default-tab').addEventListener('click', () => switchElementsVisibility('#color-picker-custom', '#color-picker-default'));
        rootEditorElement.querySelectorAll('.slds-tabs_default__item').forEach(tab => tab.addEventListener('click', (event) => {
            rootEditorElement.querySelectorAll('.slds-tabs_default__item').forEach((element) => element.classList.remove('slds-is-active'));
            event.currentTarget.classList.add('slds-is-active');
        }));
        rootEditorElement.querySelector('#cancel-button').addEventListener('click', toggleColorPanelVisibility);
        rootEditorElement.querySelector('#confirm-button').addEventListener('click', () => {
            var selectedColor = rootEditorElement.querySelector('#color-picker-input-hex-9').value;
            var selectedColorDisplay = selectedColor;
            rootEditorElement.querySelector('#color-picker-summary-input').value = selectedColor;
            rootEditorElement.querySelector('#color-picker-summary-input-display').value = selectedColorDisplay;
            rootEditorElement.querySelector('#color-picker-summary-input').dispatchEvent(new Event('change'));
            toggleColorPanelVisibility();
        });

        rootEditorElement.querySelector('.slds-color-picker__custom-range').addEventListener('dragover', satLumHandler);
        rootEditorElement.querySelector('.slds-color-picker__custom-range').addEventListener('drop', satLumHandler);
        rootEditorElement.querySelector('.slds-color-picker__custom-range').addEventListener('click', satLumHandler);
        rootEditorElement.querySelector('#color-picker-input-range-9').addEventListener('input', hueHandler);

        rootEditorElement.querySelectorAll('.slds-color-picker__swatch-trigger').forEach(
            function (element) {
                element.addEventListener('click', function (event) {
                    event.preventDefault();
                    var selectedColor = event.target.querySelector('.slds-assistive-text').innerHTML;
                    var selectedColorDisplay = event.currentTarget.getAttribute('title');
                    rootEditorElement.querySelector('#color-picker-summary-input').value = selectedColor;
                    rootEditorElement.querySelector('#color-picker-summary-input-display').value = selectedColorDisplay;
                    rootEditorElement.querySelector('#color-picker-summary-input').dispatchEvent(new Event('change'));
                    toggleColorPanelVisibility();
                });
            });

        rootEditorElement.querySelector('#color-picker-summary-input').addEventListener('change', function (event) {
            const selectedValue = event.target.value;
            const selectedValueDisplay = event.currentTarget.getAttribute('title');
            rootEditorElement.querySelector('.slds-color-picker__summary-button .slds-swatch').style.backgroundColor = selectedValue;

            emit({
                type: 'sfcc:interacted'
            });
            emit({
                type: 'sfcc:value',
                payload: selectedValue ? { value: selectedValue } : null
            });
        });

        if (selectedValue) {
            rootEditorElement.querySelector('#color-picker-summary-input').value = selectedValue;
            rootEditorElement.querySelector('#color-picker-summary-input').dispatchEvent(new Event('change'));
        }

    });
    // When a value was selected
    listen('sfcc:value', value => { });
    // When the editor must require the user to select something
    listen('sfcc:required', value => { });
    // When the editor is asked to disable its controls
    listen('sfcc:disabled', value => {
        if (rootEditorElement) {
            rootEditorElement.querySelector('.recommendation-selection').disabled = true;
        }
    });

    init();

})();
