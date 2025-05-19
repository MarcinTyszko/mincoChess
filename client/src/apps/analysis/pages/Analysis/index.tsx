import React from "react";

import AnalysisPanel from "@apps/analysis/components/AnalysisPanel";

import BoardArea from "./BoardArea";
import * as styles from "./Analysis.module.css";

function Analysis() {
    return <div className={styles.wrapper}>
        <BoardArea/>

        <AnalysisPanel/>
    </div>;
}

export default Analysis;