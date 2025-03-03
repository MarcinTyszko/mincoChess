import { merge } from "lodash";

import { LocalStorageKey } from "wintrchess";
import EngineVersion from "@constants/EngineVersion";

interface Settings {
    analysis: {
        engine: EngineVersion;
        engineDepth: number;
        engineLines: number;
        suggestionArrows: boolean;
        includedClassifications: {
            brilliant: boolean;
            theory: boolean;
        };
    };
    themes: {
        board: string;
        piece: string;
    };
}

const defaultSettings: Settings = {
    analysis: {
        engine: EngineVersion.STOCKFISH_16_1_LITE,
        engineDepth: 18,
        engineLines: 3,
        suggestionArrows: false,
        includedClassifications: {
            brilliant: true,
            theory: true
        }
    },
    themes: {
        board: "",
        piece: ""
    }
};

export function getSettings(): Settings {
    const savedSettings = localStorage.getItem(LocalStorageKey.SETTINGS);
    if (!savedSettings) return defaultSettings;

    try {
        return merge(
            defaultSettings,
            JSON.parse(savedSettings)
        );
    } catch {
        return defaultSettings;
    }
}

export function setSettings(
    updater: (settings: Settings) => Settings
) {
    const settings = updater(getSettings());

    localStorage.setItem(
        LocalStorageKey.SETTINGS,
        JSON.stringify(settings)
    );
}