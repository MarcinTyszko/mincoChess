import React from "react";
import { HexColorPicker } from "react-colorful";

import ColourSwatchProps from "./ColourSwatchProps";
import * as styles from "./ColourSwatch.module.css";

function ColourSwatch({
    colour,
    onColourChange,
    open,
    onToggle
}: ColourSwatchProps) {
    return <div className={styles.wrapper}>
        <div
            className={styles.swatch}
            style={{
                backgroundColor: colour || "white"
            }}
            onClick={event => {
                onToggle?.(!open);
                event.stopPropagation();
            }}
        ></div>

        {
            open
            && <HexColorPicker
                style={{
                    position: "absolute",
                    top: "50px",
                    right: "0",
                    zIndex: 1
                }}
                color={colour}
                onChange={onColourChange}
                onClick={event => event.stopPropagation()}
            />
        }
    </div>;
}

export default ColourSwatch;