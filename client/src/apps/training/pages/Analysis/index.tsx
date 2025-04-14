import React from "react";

import BoardArea from "./BoardArea";
import AnalysisPanel from "./AnalysisPanel";
import CaptchaArea from "./CaptchaArea";
import * as styles from "./Analysis.module.css";

function Analysis() {
    return <div className={styles.wrapper}>
        <BoardArea/>

        <AnalysisPanel/>

        <CaptchaArea/>
    </div>;
}

export default Analysis;