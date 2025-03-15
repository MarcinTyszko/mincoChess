import { useState } from "react";

import LocalStorageKey from "@constants/LocalStorageKey";

function useLocalStorage<ValueType>(key: LocalStorageKey) {
    const [ , setLocalValue ] = useState<string>();

    function get() {
        return localStorage.getItem(key);
    }

    function set(value: Partial<ValueType>) {
        const newValue = typeof value == "object"
            ? JSON.stringify(value)
            : String(value);

        localStorage.setItem(key, newValue);

        setLocalValue(newValue);
    }

    function parse(): Partial<ValueType> {
        const value = get();

        if (value == null) return {};

        try {
            return JSON.parse(value);
        } catch {
            return {};
        }
    }

    return {
        value: get(),
        parsedValue: parse(),
        set: set
    };
}

export default useLocalStorage;