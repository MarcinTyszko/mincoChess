import { useState } from "react";

import { LocalStorageKey } from "wintrchess";

function useLocalStorage<ValueType>(key: LocalStorageKey) {
    const [ value, setValue ] = useState(
        localStorage.getItem(key)
    );

    function set(value: Partial<ValueType>) {
        let newValue = typeof value == "object"
            ? JSON.stringify(value)
            : String(value);

        localStorage.setItem(key, newValue);

        setValue(newValue);
    }

    function parse(): Partial<ValueType> {
        if (value == null) return {};

        try {
            return JSON.parse(value);
        } catch {
            return {};
        }
    }

    return {
        value: value,
        parsedValue: parse(),
        set: set
    };
}

export default useLocalStorage;