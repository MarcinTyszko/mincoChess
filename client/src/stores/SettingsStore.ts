import { create } from "zustand";

import { LocalStorageKey, EngineVersion } from "wintrchess";
import { merge } from "lodash";

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

type SettingsReducer = (settings: Settings) => Settings;

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

function fetchSettings() {
    const value = localStorage.getItem(LocalStorageKey.SETTINGS);

    if (value == null) {
        return defaultSettings;
    }

    try {
        return merge(
            defaultSettings,
            JSON.parse(value)
        );
    } catch {
        return defaultSettings;
    }
}

interface SettingsStore {
    settings: Settings;
    setSettings: (updater: SettingsReducer) => void;
}

const useSettingsStore = create<SettingsStore>((set, get) => ({
    settings: fetchSettings(),

    setSettings(updater) {
        const newSettings = updater(get().settings);

        set({ settings: newSettings });

        localStorage.setItem(
            LocalStorageKey.SETTINGS,
            JSON.stringify(newSettings)
        );
    }
}));

export default useSettingsStore;