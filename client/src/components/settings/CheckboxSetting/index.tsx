import React, { useState } from "react";
import Switch from "react-switch";

import CheckboxSettingProps from "./CheckboxSettingProps";

function CheckboxSetting({
    defaultChecked,
    onChange
}: CheckboxSettingProps) {
    const [ checked, setChecked ] = useState(defaultChecked);

    return <Switch
        checked={checked}
        onChange={newChecked => {
            setChecked(newChecked);
            onChange(newChecked);
        }}
        height={25}
        onColor="#467de8"
        offColor="#2c2f35"
        uncheckedIcon={false}
        checkedIcon={false}
    />;
}

export default CheckboxSetting;