import './thirdParty/jquery';
import './slider/initSlider';
import 'base/thirdParty/bootstrap';
import './components/spinner';
import './components/imageZoom';

import processInclude from 'base/util';

import menu from 'base/components/menu';
import cookie from 'base/components/cookie';
import consentTracking from 'base/components/consentTracking';
import footer from 'base/components/footer';
import collapsibleItem from 'base/components/collapsibleItem';
import search from 'base/components/search';
import clientSideValidation from 'base/components/clientSideValidation';
import countrySelector from 'base/components/countrySelector';
import toolTip from 'base/components/toolTip';
import miniCart from 'base/components/miniCart';
import customModal from './components/customModal';

$(document).ready(() => {
    processInclude(menu);
    processInclude(cookie);
    processInclude(consentTracking);
    processInclude(footer);
    processInclude(miniCart);
    processInclude(collapsibleItem);
    processInclude(search);
    processInclude(clientSideValidation);
    processInclude(countrySelector);
    processInclude(toolTip);
    processInclude(customModal);
});

