import React from "react";

import BoardArea from "./BoardArea";
import ReportArea from "./ReportArea";
import * as styles from "./Analysis.module.css";

function Analysis() {
    return <div className={styles.wrapper}>
        <BoardArea/>

        <ReportArea/>
    </div>;
}

export default Analysis;