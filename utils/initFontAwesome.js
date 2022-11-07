import { library } from '@fortawesome/fontawesome-svg-core';
import { faLink, faPowerOff, faUser, FaInstagram, FaTwitter, FaYoutube } from '@fortawesome/free-solid-svg-icons';

function initFontAwesome() {
    library.add(faLink);
    library.add(faUser);
    library.add(faPowerOff);
    // library.add(FaInstagram);
    // library.add(FaTwitter);
    // library.add(FaYoutube);
}

export default initFontAwesome;
