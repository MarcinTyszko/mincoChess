import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import languages from "@i18n/languages";
import LocalStorageKey from "@constants/LocalStorageKey";
import DropdownSetting from "@components/settings/DropdownSetting";

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const savedLanguage = useMemo(() => {
        const preferredLanguage = localStorage.getItem(
            LocalStorageKey.PREFERRED_LANGUAGE
        );

        if (!preferredLanguage) return;

        return languages.find(lang => lang.id == preferredLanguage);
    }, []);

    return <DropdownSetting
        options={languages}
        defaultValue={savedLanguage || languages.find(
            language => language.id == "en"
        )}
        onSelect={language => {
            if (!language?.id) return;

            i18n.changeLanguage(language.id);

            localStorage.setItem(
                LocalStorageKey.PREFERRED_LANGUAGE,
                language.id
            );
        }}
        dropdownStyle={{
            width: "52px",
            height: "42px"
        }}
        dropdownLabelStyle={{ justifyContent: "center" }}
        dropdownArrowStyle={{ display: "none" }}
        dropdownLabelRenderer={selectedLanguage => <img
            src={selectedLanguage.flag}
            height={25}
        />}
    />;
}

export default LanguageSwitcher;