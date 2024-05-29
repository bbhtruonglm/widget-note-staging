import { createI18n } from "vue-i18n";

// lang
import viLang from "./vietnamese";
import enLang from "./english";
import thLang from "./thai";

const vi = viLang;
const vn = viLang;
const en = enLang;
const us = enLang;
const th = thLang;

/* get lang from native app */
function getParameterByName(name: string, url = window.location.href) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const getLang = () => {
    let lang =
        getParameterByName("locale") || localStorage.getItem("lang") || "vi";
    localStorage.setItem("lang", lang);
    return lang;
};

export const i18n = createI18n({
    locale: getLang(),
    messages: {
        vi,
        vn,
        en,
        us,
        th,
    },
    fallbackLocale: "vi",
});
