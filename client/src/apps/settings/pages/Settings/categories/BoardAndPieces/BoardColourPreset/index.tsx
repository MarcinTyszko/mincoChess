import React from "react";

import BoardColourPresetProps from "./BoardColourPresetProps";
import * as styles from "./BoardColourPreset.module.css";

function BoardColourPreset({
    lightSquareColour,
    darkSquareColour,
    title,
    selected,
    onClick
}: BoardColourPresetProps) {
    return <div
        className={styles.wrapper}
        style={{
            border: selected
                ? "2px solid var(--ui-blue)"
                : undefined
        }}
        title={title}
        onClick={onClick}
    >
        <div style={{ backgroundColor: lightSquareColour }}>
            <img
                src={require("@assets/img/pieces/standard/black_king.svg")}
                style={{ width: "100%" }}
            />
        </div>

        <div style={{ backgroundColor: darkSquareColour }} />

        <div style={{ backgroundColor: darkSquareColour }} />

        <div style={{ backgroundColor: lightSquareColour }}>
            <img
                src={require("@assets/img/pieces/standard/white_king.svg")}
                style={{ width: "100%" }}
            />
        </div>
    </div>;
}

export default BoardColourPreset;