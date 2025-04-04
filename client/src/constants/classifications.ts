import { Classification } from "wintrchess";

export const classifications = [
    Classification.BRILLIANT,
    Classification.ONLY,
    Classification.BEST,
    Classification.EXCELLENT,
    Classification.OKAY,
    Classification.INACCURACY,
    Classification.MISTAKE,
    Classification.BLUNDER,
    Classification.FORCED,
    Classification.THEORY,
    Classification.RISKY
];

export const classificationImages = {
    [Classification.BRILLIANT]: require("@assets/img/classifications/brilliant.png"),
    [Classification.ONLY]: require("@assets/img/classifications/only.png"),
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

export const classificationColours = {
    [Classification.BRILLIANT]: "#1baaa6",
    [Classification.ONLY]: "#5b8baf",
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
    [Classification.BRILLIANT]: "Brilliant",
    [Classification.ONLY]: "Only Move",
    [Classification.BEST]: "Best",
    [Classification.EXCELLENT]: "Excellent",
    [Classification.OKAY]: "Okay",
    [Classification.INACCURACY]: "Inaccuracy",
    [Classification.MISTAKE]: "Mistake",
    [Classification.BLUNDER]: "Blunder",
    [Classification.FORCED]: "Forced",
    [Classification.THEORY]: "Theory",
    [Classification.RISKY]: "Risky"
};

export const inalterableClassifications = [
    Classification.BRILLIANT,
    Classification.ONLY,
    Classification.BEST,
    Classification.FORCED,
    Classification.THEORY
];