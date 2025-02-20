import { LocalStorageKey } from "wintrchess";
import EngineVersion from "@constants/EngineVersion";

import useLocalStorage from "./useLocalStorage";

interface Settings {
    analysis: {
        engine: EngineVersion;
        engineDepth: number;
        engineLines: number;
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

function useSettings() {
    const {
        parsedValue: settings,
        set: setSettings
    } = useLocalStorage<Settings>(LocalStorageKey.SETTINGS);

    const combinedSettings: Settings = {
        analysis: {
            ...defaultSettings.analysis,
            ...settings.analysis,
            includedClassifications: {
                ...defaultSettings.analysis.includedClassifications,
                ...settings.analysis?.includedClassifications
            }
        },
        themes: {
            ...defaultSettings.themes,
            ...settings.themes
        }
    };

    return {
        settings: combinedSettings,
        setSettings: setSettings
    };
}

export default useSettings;