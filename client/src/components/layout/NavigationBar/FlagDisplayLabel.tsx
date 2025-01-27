import React from "react";
import { components, SingleValueProps } from "react-select";

import LanguageOption from "@ctypes/LanguageOption";

function FlagDisplayLabel(props: SingleValueProps<LanguageOption>) {
    return <components.SingleValue {...props}>
        <img
            src={props.data.flag}
            height={25}
        />
    </components.SingleValue>;
}

export default FlagDisplayLabel;