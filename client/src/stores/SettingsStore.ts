import { create } from "zustand";
import { produce } from "immer";
import { cloneDeep, merge } from "lodash";

import { EngineVersion } from "wintrchess";
import LocalStorageKey from "@constants/LocalStorageKey";

interface Settings {
    analysis: {
        engineEnabled: boolean;
        engine: EngineVersion;
        engineDepth: number;
        engineLines: number;
        hideClassifications: boolean;
        suggestionArrows: boolean;
        includedClassifications: {
            brilliant: boolean;
            theory: boolean;
        };
    };
    themes: {
        board: {
            lightSquareColour: string;
            darkSquareColour: string;
        };
        piece: string;
    };
    openBeta: {
        bugReportingMode: boolean;
    };
}

type SettingsReducer = (settings: Settings) => Settings;

export const defaultSettings: Settings = {
    analysis: {
        engineEnabled: true,
        engine: EngineVersion.STOCKFISH_17_LITE,
        engineDepth: 18,
        engineLines: 3,
        hideClassifications: false,
        suggestionArrows: false,
        includedClassifications: {
            brilliant: true,
            theory: true
        }
    },
    themes: {
        board: {
            darkSquareColour: "#b58863",
            lightSquareColour: "#f0d9b5"
        },
        piece: ""
    },
    openBeta: {
        bugReportingMode: false
    }
};

function fetchSettings() {
    const value = localStorage.getItem(LocalStorageKey.SETTINGS);

    const defaultSettingsCopy = cloneDeep(defaultSettings);

    if (value == null) {
        return defaultSettingsCopy;
    }

    try {
        return merge(
            defaultSettingsCopy,
            JSON.parse(value)
        );
    } catch {
        return defaultSettingsCopy;
    }
}

interface SettingsStore {
    settings: Settings;
    setSettings: (updater: SettingsReducer) => void;
}

const useSettingsStore = create<SettingsStore>((set, get) => ({
    settings: fetchSettings(),

    setSettings(updater) {
        const newSettings = produce(get().settings, updater);

        set({ settings: newSettings });

        localStorage.setItem(
            LocalStorageKey.SETTINGS,
            JSON.stringify(newSettings)
        );
    }
}));

export default useSettingsStore;