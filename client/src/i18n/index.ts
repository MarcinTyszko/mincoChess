import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import LocalStorageKey from "@constants/LocalStorageKey";

import languages from "./languages";

i18next
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        resources: Object.fromEntries(
            languages.map(lang => [
                lang.id,
                { translation: lang.translations }
            ])
        )
    })
    .then(() => {
        const preferredLanguage = localStorage.getItem(
            LocalStorageKey.PREFERRED_LANGUAGE
        );

        if (!preferredLanguage) return;
        if (!languages.find(lang => lang.id == preferredLanguage)) return;

        i18next.changeLanguage(
            String(preferredLanguage)
        );
    });