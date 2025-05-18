import { Classification } from "wintrchess";

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
    [Classification.BRILLIANT]: "pages.analysis.classifications.brilliant",
    [Classification.CRITICAL]: "pages.analysis.classifications.critical",
    [Classification.BEST]: "pages.analysis.classifications.best",
    [Classification.EXCELLENT]: "pages.analysis.classifications.excellent",
    [Classification.OKAY]: "pages.analysis.classifications.okay",
    [Classification.INACCURACY]: "pages.analysis.classifications.inaccuracy",
    [Classification.MISTAKE]: "pages.analysis.classifications.mistake",
    [Classification.BLUNDER]: "pages.analysis.classifications.blunder",
    [Classification.FORCED]: "pages.analysis.classifications.forced",
    [Classification.THEORY]: "pages.analysis.classifications.theory",
    [Classification.RISKY]: "pages.analysis.classifications.risky"
};

export const inalterableClassifications = [
    Classification.BRILLIANT,
    Classification.CRITICAL,
    Classification.BEST,
    Classification.FORCED,
    Classification.THEORY
];