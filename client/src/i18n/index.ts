import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import english from "./translations/en.json";
import catSpeak from "./translations/cat.json";

i18next
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        resources: {
            en: { translation: english },
            cat: { translation: catSpeak }
        }
    });