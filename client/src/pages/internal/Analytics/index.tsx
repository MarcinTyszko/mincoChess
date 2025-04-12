import React from "react";

import useProtectedRoute from "@hooks/useProtectedRoute";

import * as styles from "./Analytics.module.css";

function Analytics() {
    useProtectedRoute();

    return <div className={styles.wrapper}>
        <h1>Under Construction 🚧</h1>
    </div>;
}

export default Analytics;