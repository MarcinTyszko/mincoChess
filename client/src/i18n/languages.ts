import LanguageOption from "@ctypes/LanguageOption";

const languages: LanguageOption[] = [
    {
        id: "en",
        label: "English",
        flag: require("@assets/img/flags/GB.png"),
        translations: require("./translations/en.json")
    },
    {
        id: "hi",
        label: "हिन्दी",
        flag: require("@assets/img/flags/IN.png"),
        translations: require("./translations/hi.json")
    },
    {
        id: "mr",
        label: "मराठी",
        flag: require("@assets/img/flags/IN.png"),
        translations: require("./translations/mr.json")
    },
    {
        id: "vi",
        label: "Tiếng Việt",
        flag: require("@assets/img/flags/VN.png"),
        translations: require("./translations/vi.json")
    },
    {
        id: "es",
        label: "Español",
        flag: require("@assets/img/flags/ES.png"),
        translations: require("./translations/es.json")
    },
    // {
    //     id: "fil",
    //     label: "Filipino",
    //     flag: require("@assets/img/flags/PH.png"),
    //     translations: require("./translations/en.json")
    // },
    // {
    //     id: "ar",
    //     label: "العربية",
    //     flag: require("@assets/img/flags/SA.png"),
    //     translations: require("./translations/en.json")
    // },
    // {
    //     id: "pt",
    //     label: "Português",
    //     flag: require("@assets/img/flags/PT.png"),
    //     translations: require("./translations/en.json")
    // },
    {
        id: "pl",
        label: "Polski",
        flag: require("@assets/img/flags/PL.png"),
        translations: require("./translations/pl.json")
    },
    // {
    //     id: "id",
    //     label: "Bahasa Indonesia",
    //     flag: require("@assets/img/flags/ID.png"),
    //     translations: require("./translations/en.json")
    // },
    {
        id: "fr",
        label: "Français",
        flag: require("@assets/img/flags/FR.png"),
        translations: require("./translations/fr.json")
    },
    {
        id: "de",
        label: "Deutsch",
        flag: require("@assets/img/flags/DE.png"),
        translations: require("./translations/de.json")
    },
    {
        id: "zh",
        label: "中文",
        flag: require("@assets/img/flags/CN.png"),
        translations: require("./translations/zh.json")
    }
];

export default languages;