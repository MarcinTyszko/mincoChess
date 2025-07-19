import { Classification } from "shared/constants/Classification";

export const classificationImages = {
    [Classification.BRILLIANT]: require("@assets/img/classifications/brilliant.png"),
    [Classification.CRITICAL]: require("@assets/img/classifications/critical.png"),
    [Classification.BEST]: require("@assets/img/classifications/best.png"),
    [Classification.EXCELLENT]: require("@assets/img/classifications/excellent.png"),
    [Classification.OKAY]: require("@assets/img/classifications/okay.png"),
    [Classification.INACCURACY]: require("@assets/img/classifications/inaccuracy.png"),
    [Classification.MISTAKE]: require("@assets/img/classifications/mistake.png"),
    [Classification.BLUNDER]: require("@assets/img/classifications/blunder.png"),
    [Classification.FORCED]: require("@assets/img/classifications/forced.png"),
    [Classification.THEORY]: require("@assets/img/classifications/theory.png"),
    [Classification.RISKY]: require("@assets/img/classifications/risky.png")
};

export const loadingClassificationIcon = require(
    "@assets/img/classifications/loading.png"
);

export const errorClassificationIcon = require(
    "@assets/img/classifications/error.png"
);

export const classificationColours = {
    [Classification.BRILLIANT]: "#1baaa6",
    [Classification.CRITICAL]: "#5b8baf",
    [Classification.BEST]: "#98bc49",
    [Classification.EXCELLENT]: "#98bc49",
    [Classification.OKAY]: "#97af8b",
    [Classification.INACCURACY]: "#f4bf44",
    [Classification.MISTAKE]: "#e28c28",
    [Classification.BLUNDER]: "#c93230",
    [Classification.FORCED]: "#97af8b",
    [Classification.THEORY]: "#a88764",
    [Classification.RISKY]: "#8983ac"
};

export const classificationNames = {
    [Classification.BRILLIANT]: "classifications.brilliant",
    [Classification.CRITICAL]: "classifications.critical",
    [Classification.BEST]: "classifications.best",
    [Classification.EXCELLENT]: "classifications.excellent",
    [Classification.OKAY]: "classifications.okay",
    [Classification.INACCURACY]: "classifications.inaccuracy",
    [Classification.MISTAKE]: "classifications.mistake",
    [Classification.BLUNDER]: "classifications.blunder",
    [Classification.FORCED]: "classifications.forced",
    [Classification.THEORY]: "classifications.theory",
    [Classification.RISKY]: "classifications.risky"
};

export const inalterableClassifications = [
    Classification.BRILLIANT,
    Classification.CRITICAL,
    Classification.BEST,
    Classification.FORCED,
    Classification.THEORY
];

// https://en.wikipedia.org/wiki/Portable_Game_Notation#Standard_NAGs
export const classificationNags: Record<string, string | undefined> = {
    [Classification.BRILLIANT]: "$3",
    [Classification.CRITICAL]: "$1",
    [Classification.INACCURACY]: "$6",
    [Classification.MISTAKE]: "$2",
    [Classification.BLUNDER]: "$4",
    [Classification.RISKY]: "$5"
};