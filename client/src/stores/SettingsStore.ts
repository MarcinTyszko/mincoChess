import { create } from "zustand";
import { produce } from "immer";
import { cloneDeep, merge } from "lodash";
import z from "zod";

import { EngineVersion, deepPartialify } from "wintrchess";
import EngineArrowType from "@constants/EngineArrowType";
import LocalStorageKey from "@constants/LocalStorageKey";

const settingsSchema = z.object({
    analysis: z.object({
        engineEnabled: z.boolean(),
        engine: z.nativeEnum(EngineVersion),
        engineDepth: z.number().min(10).max(99),
        engineLimitTime: z.boolean(),
        engineMoveTime: z.number().min(0.01),
        engineLines: z.number().min(1).max(5),
        engineThreadCount: z.number().min(1).max(64),
        hideClassifications: z.boolean(),
        engineArrows: z.nativeEnum(EngineArrowType),
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

const partialSettingsSchema = deepPartialify(settingsSchema);

type Settings = z.infer<typeof settingsSchema>;

type SettingsReducer = (settings: Settings) => Settings;

export const defaultSettings: Settings = {
    analysis: {
        engineEnabled: true,
        engine: EngineVersion.STOCKFISH_17_LITE,
        engineDepth: 16,
        engineLines: 2,
        engineLimitTime: false,
        engineMoveTime: 1,
        engineThreadCount: 4,
        hideClassifications: false,
        engineArrows: EngineArrowType.DISABLED,
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

        partialSettingsSchema.parse(fetchedSettings);

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