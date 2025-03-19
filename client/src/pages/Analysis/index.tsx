import React from "react";

import BoardArea from "./BoardArea";
import AnalysisPanel from "./AnalysisPanel";
import * as styles from "./Analysis.module.css";
import CaptchaArea from "./CaptchaArea";

function Analysis() {
    return <div className={styles.wrapper}>
        <BoardArea/>

        <AnalysisPanel/>

        <CaptchaArea/>
    </div>;
}

export default Analysis;