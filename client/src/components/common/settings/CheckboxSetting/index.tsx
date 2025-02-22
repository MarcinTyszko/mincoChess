import React from "react";

import CheckboxSettingProps from "./CheckboxSettingProps";
import * as styles from "../Setting.module.css";

function CheckboxSetting({
    getInitialValue,
    onChange,
    style
}: CheckboxSettingProps) {
    return <input
        className={styles.settingsField}
        type="checkbox"
        checked={getInitialValue()}
        onChange={event => onChange(event.target.checked)}
        style={style}
    />;
}

export default CheckboxSetting;