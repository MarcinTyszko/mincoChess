import React from "react";
import { ControlProps, components } from "react-select";

import LanguageOption from "../../../types/LanguageOption";
import * as styles from "./NavigationBar.module.css";

function LanguageSwitcher(props: ControlProps<LanguageOption>) {
    return <components.Control
        {...props}
        className={styles.languageSwitcher}
    />;
}

export default LanguageSwitcher;