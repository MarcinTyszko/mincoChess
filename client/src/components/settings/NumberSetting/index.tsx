import React from "react";

import NumberSettingProps from "./NumberSettingProps";
import * as styles from "../Setting.module.css";

function NumberSetting({
    min,
    max,
    defaultValue,
    onChange,
    style
}: NumberSettingProps) {
    return <input
        className={styles.settingsField}
        style={style}
        type="number"
        min={min}
        max={max}
        defaultValue={defaultValue}
        onChange={event => onChange?.(
            parseInt(event.target.value)
        )}
    />;
}

export default NumberSetting;