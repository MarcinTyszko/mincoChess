import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { Cookies } from "react-cookie";

import { Cookie } from "wintrchess";

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
        const cookies = new Cookies();

        const preferredLanguage = cookies.get(Cookie.PREFERRED_LANGUAGE);

        if (!preferredLanguage) return;

        i18next.changeLanguage(
            String(preferredLanguage)
        );
    });