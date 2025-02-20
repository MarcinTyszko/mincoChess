import React from "react";

import DropdownSettingProps from "./DropdownSettingProps";
import * as styles from "../Setting.module.css";

function DropdownSetting({
    options,
    getInitialValue,
    onSelect,
    style
}: DropdownSettingProps) {
    return <select
        className={styles.settingsField}
        style={style}
        value={getInitialValue()}
        onChange={event => onSelect(event.target.value)}
    >
        {
            options.map(opt => <option value={opt.value}>
                {opt.label}
            </option>)
        }
    </select>;
}

export default DropdownSetting;