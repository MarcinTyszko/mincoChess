import React, { useEffect } from "react";

import Button from "../Button";

import DialogProps from "./DialogProps";
import * as styles from "./Dialog.module.css";

function Dialog({
    children,
    setOpen,
    className,
    style,
    closeButtonStyle
}: DialogProps) {
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return <div
        className={styles.wrapper}
        onClick={event => event.stopPropagation()}
    >
        <div
            className={`${styles.menu} ${className}`}
            style={style}
        >
            <Button
                className={styles.closeButton}
                icon={require("@assets/img/interface/close.svg")}
                iconSize="30px"
                style={closeButtonStyle}
                onClick={() => setOpen(false)}
            />;

            {children}
        </div>
    </div>;
}

export default Dialog;