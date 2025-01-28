import LanguageOption from "@ctypes/LanguageOption";

const languages: LanguageOption[] = [
    {
        id: "en",
        label: "English",
        flag: require("@assets/img/flags/uk.png"),
        translations: require("./translations/en.json")
    },
    {
        id: "hi",
        label: "हिन्दी",
        flag: require("@assets/img/flags/india.png"),
        translations: require("./translations/cat.json")
    },
    {
        id: "sr",
        label: "Српски",
        flag: require("@assets/img/flags/serbia.png"),
        translations: require("./translations/cat.json")
    },
    {
        id: "ja",
        label: "日本語",
        flag: require("@assets/img/flags/japan.png"),
        translations: require("./translations/cat.json")
    }
];

export default languages;