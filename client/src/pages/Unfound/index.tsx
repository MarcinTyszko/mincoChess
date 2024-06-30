import React from "react";
import { Link } from "react-router-dom";

import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";

import * as styles from "./Unfound.module.css";

function Unfound() {
    return <div className={styles.wrapper}>
        <h1 className={styles.errorCode}>404</h1>
        <span>Looks like you're lost.</span>

        <img
            className={styles.image}
            src={require("@assets/img/unfoundgame.gif")}
        />

        <Link to="/">
            <Button 
                colour={ButtonColour.BLUE}
                icon={require("@assets/img/back.svg")}
                options={{
                    iconSize: "30px"
                }}
                style={{
                    padding: "5px 10px"
                }}
            >
                Return Home
            </Button>
        </Link>
    </div>;
}

export default Unfound;