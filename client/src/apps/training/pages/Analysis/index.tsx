import React, { useEffect } from "react";

import { useAltcha } from "@hooks/useAltcha";

import BoardArea from "./BoardArea";
import AnalysisPanel from "./AnalysisPanel";
import * as styles from "./Analysis.module.css";
import CaptchaArea from "./CaptchaArea";

function Analysis() {
    const executeCaptcha = useAltcha();

    useEffect(() => {
        executeCaptcha();
    }, []);

    return <div className={styles.wrapper}>
        <BoardArea/>

        <AnalysisPanel/>

        <CaptchaArea/>
    </div>;
}

export default Analysis;