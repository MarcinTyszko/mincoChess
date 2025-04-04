import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Select, { SingleValue } from "react-select";

import LocalStorageKey from "@constants/LocalStorageKey";
import languages from "@i18n/languages";
import LanguageOption from "@ctypes/LanguageOption";
import { FlagDisplayLabel, LanguageSwitcherControl } from "./components";

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const savedLanguage = useMemo(() => {
        const preferredLanguage = localStorage.getItem(
            LocalStorageKey.PREFERRED_LANGUAGE
        );

        if (!preferredLanguage) return;

        return languages.find(lang => lang.id == preferredLanguage);
    }, []);

    return <Select
        options={languages}
        defaultValue={
            savedLanguage
            || languages.find(lang => lang.id == "en")
        }
        getOptionLabel={option => option.label}
        styles={{
            control: baseStyles => ({
                ...baseStyles,
                width: "52px",
                height: "42px",
                backgroundColor: "var(--ui-shade-5)",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transitionDuration: "0.3s"
            }),
            singleValue: baseStyles => ({
                ...baseStyles,
                display: "flex",
                justifyContent: "center",
                alignContent: "center"
            }),
            menu: baseStyles => ({
                ...baseStyles,
                width: "200px",
                left: "-148px",
                backgroundColor: "var(--ui-shade-4)",
                color: "white"
            }),
            option: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: state.isFocused
                    ? "var(--ui-shade-3)"
                    : "var(--ui-shade-4)",
                cursor: "pointer",
                transitionDuration: "0.3s"
            })
        }}
        components={{
            Control: LanguageSwitcherControl,
            SingleValue: FlagDisplayLabel,
            DropdownIndicator: null
        }}
        isSearchable={false}
        onChange={option => {
            option = option as SingleValue<LanguageOption>;

            if (!option?.id) return;

            i18n.changeLanguage(option.id);

            localStorage.setItem(
                LocalStorageKey.PREFERRED_LANGUAGE,
                option.id
            );
        }}
    />;
}

export default LanguageSwitcher;