import React from "react";

import NumberSettingProps from "./NumberSettingProps";
import * as styles from "../Setting.module.css";

function NumberSetting({
    min,
    max,
    getInitialValue,
    onChange,
    style
}: NumberSettingProps) {
    return <input
        className={styles.settingsField}
        style={style}
        type="number"
        min={min}
        max={max}
        value={getInitialValue()}
        onChange={event => onChange(
            parseInt(event.target.value)
        )}
    />;
}

export default NumberSetting;