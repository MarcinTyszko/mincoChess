import React from "react";

import Button from "@/components/common/Button";
import ButtonColour from "@/components/common/Button/Colour";

import * as styles from "./Unfound.module.css";

function Unfound() {
    return <div className={styles.wrapper}>
        <h1 className={styles.errorCode}>404</h1>
        <span>Looks like you're lost.</span>

        <img
            className={styles.image}
            src={require("@assets/img/unfoundgame.gif")}
        />

        <a href="/">
            <Button
                icon={require("@assets/img/interface/back.svg")}
                iconSize="30px"
                style={{
                    backgroundColor: ButtonColour.BLUE,
                    padding: "5px 10px"
                }}
            >
                Return Home
            </Button>
        </a>
    </div>;
}

export default Unfound;