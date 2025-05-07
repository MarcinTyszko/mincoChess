import { create } from "zustand";
import { produce } from "immer";
import { cloneDeep, merge } from "lodash";
import z from "zod";

import { EngineVersion } from "wintrchess";
import LocalStorageKey from "@constants/LocalStorageKey";

const settingsSchema = z.object({
    analysis: z.object({
        engineEnabled: z.boolean(),
        engine: z.nativeEnum(EngineVersion),
        engineDepth: z.number().min(10).max(99),
        engineLines: z.number().min(1).max(5),
        engineThreadCount: z.number().min(1).max(64),
        hideClassifications: z.boolean(),
        suggestionArrows: z.boolean(),
        includedClassifications: z.object({
            brilliant: z.boolean(),
            theory: z.boolean()
        })
    }),
    themes: z.object({
        board: z.object({
            darkSquareColour: z.string().regex(/^#.{6}$/),
            lightSquareColour: z.string().regex(/^#.{6}$/)
        }),
        piece: z.string()
    }),
    bugReportingMode: z.boolean()
});

type Settings = z.infer<typeof settingsSchema>;

type SettingsReducer = (settings: Settings) => Settings;

export const defaultSettings: Settings = {
    analysis: {
        engineEnabled: true,
        engine: EngineVersion.STOCKFISH_17_LITE,
        engineDepth: 16,
        engineLines: 2,
        engineThreadCount: 4,
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
    bugReportingMode: false
};

function fetchSettings() {
    const value = localStorage.getItem(LocalStorageKey.SETTINGS);

    const defaultSettingsCopy = cloneDeep(defaultSettings);

    if (value == null) {
        return defaultSettingsCopy;
    }

    try {
        const fetchedSettings = JSON.parse(value);

        settingsSchema.parse(fetchedSettings);

        return merge(defaultSettingsCopy, fetchedSettings);
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