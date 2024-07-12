import React from "react";

import useProtectedRoute from "@hooks/useProtectedRoute";

import * as styles from "./Dashboard.module.css";

function Dashboard() {
    useProtectedRoute();

    return <div className={styles.wrapper}>
        <span className={styles.yay}>DASHBOARD! yay!! &lt;3</span>
    </div>;
}

export default Dashboard;