import React from "react";
import { Link } from "react-router-dom";

import * as styles from "./Unfound.module.css";

function Unfound() {
    return <div className={styles.wrapper}>
        <h1>404</h1>
        <span>Looks like you're lost.</span>

        <img src={require("@assets/img/unfound.gif")} />

        <Link to="/">Return Home</Link>
    </div>;
}

export default Unfound;