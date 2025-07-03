import React from "react";

import Advertisement from "@/components/Advertisement";
import AnalysisPanel from "@analysis/components/AnalysisPanel";

import BoardArea from "./BoardArea";
import * as styles from "./Analysis.module.css";

function Analysis() {
    return <div className={styles.wrapper}>
        <div className={styles.advertisement}>
            <Advertisement adUnitId="6032766700" style={{
                width: "100%", height: "100px"
            }}/>
        </div>

        <div className={styles.analysisSection}>
            <BoardArea/>

            <AnalysisPanel className={styles.panel} />
        </div>

        <div className={styles.advertisement}>
            <Advertisement adUnitId="7734244071" style={{
                width: "100%", height: "100px"
            }}/>
        </div>
    </div>;
}

export default Analysis;