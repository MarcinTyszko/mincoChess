import React from "react";

import BoardArea from "./BoardArea";
import AnalysisPanel from "./AnalysisPanel";
import * as styles from "./Analysis.module.css";

function Analysis() {
    return <div className={styles.wrapper}>
        <BoardArea/>

        <AnalysisPanel/>
    </div>;
}

export default Analysis;