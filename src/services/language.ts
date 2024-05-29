import { i18n } from "../lang/i18n";
import type { App } from "vue";
export const loadLanguage = (APP: App) => {
    APP.use(i18n);
};
