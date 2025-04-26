import React from "react";

import SeparatorProps from "./SeparatorProps";
import * as styles from "./Separator.module.css";

function Separator({ style }: SeparatorProps) {
    return <hr
        className={styles.separator}
        style={style}
    />;
}

export default Separator;