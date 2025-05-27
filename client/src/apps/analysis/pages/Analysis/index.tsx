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

        <div style={{ padding: "0 30px" }}>
            <Advertisement adUnitId="7734244071" style={{
                height: "100px"
            }}/>
        </div>
    </div>;
}

export default Analysis;