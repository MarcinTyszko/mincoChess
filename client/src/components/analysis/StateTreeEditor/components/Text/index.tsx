import React from "react";

import TextProps from "./TextProps";
import * as styles from "./Text.module.css";

function Text({ children }: TextProps) {
    return <span className={styles.text}>
        {children}
    </span>;
}

export default Text;