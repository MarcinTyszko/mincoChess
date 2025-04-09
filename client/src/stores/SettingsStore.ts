import { create } from "zustand";
import { produce } from "immer";
import { merge } from "lodash";

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
        board: string;
        piece: string;
    };
}

type SettingsReducer = (settings: Settings) => Settings;

const defaultSettings: Settings = {
    analysis: {
        engineEnabled: true,
        engine: EngineVersion.STOCKFISH_16_1_LITE,
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
        const newSettings = produce(get().settings, updater);

        set({ settings: newSettings });

        localStorage.setItem(
            LocalStorageKey.SETTINGS,
            JSON.stringify(newSettings)
        );
    }
}));

export default useSettingsStore;