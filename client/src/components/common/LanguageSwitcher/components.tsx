import React from "react";
import { components, SingleValueProps, ControlProps } from "react-select";

import LanguageOption from "@ctypes/LanguageOption";

import * as styles from "./LanguageSwitcher.module.css";

export function FlagDisplayLabel(props: SingleValueProps<LanguageOption>) {
    return <components.SingleValue {...props}>
        <img
            src={props.data.flag}
            height={25}
        />
    </components.SingleValue>;
}

export function LanguageSwitcherControl(props: ControlProps<LanguageOption>) {
    return <components.Control
        {...props}
        className={styles.languageSwitcher}
    />;
}