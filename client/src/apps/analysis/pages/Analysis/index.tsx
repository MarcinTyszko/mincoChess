import React from "react";

import Advertisement from "@components/Advertisement";
import AnalysisPanel from "@apps/analysis/components/AnalysisPanel";

import BoardArea from "./BoardArea";
import * as styles from "./Analysis.module.css";

function Analysis() {
    return <div className={styles.wrapper}>
        <div className={styles.analysisSection}>
            <BoardArea/>

            <AnalysisPanel className={styles.panel} />
        </div>

        <Advertisement adUnitId="7734244071" style={{
            padding: "30px", paddingTop: 0
        }}/>
    </div>;
}

export default Analysis;