import LanguageOption from "@ctypes/LanguageOption";

const languages: LanguageOption[] = [
    {
        id: "en",
        label: "English",
        flag: require("@assets/img/flags/uk.png")
    },
    {
        id: "hi",
        label: "हिन्दी",
        flag: require("@assets/img/flags/india.png")
    },
    {
        id: "sr",
        label: "Српски",
        flag: require("@assets/img/flags/serbia.png")
    },
    {
        id: "ja",
        label: "日本語",
        flag: require("@assets/img/flags/japan.png")
    }
];

export default languages;