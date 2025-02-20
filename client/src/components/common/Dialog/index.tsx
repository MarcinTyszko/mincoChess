import React from "react";

import DialogCloseButton from "./DialogCloseButton";
import DialogProps from "./DialogProps";
import * as styles from "./Dialog.module.css";

function Dialog({
    children,
    setOpen,
    className,
    style,
    closeButtonStyle
}: DialogProps) {
    return <div
        className={styles.wrapper}
        onClick={event => event.stopPropagation()}
    >
        <div
            className={`${styles.menu} ${className}`}
            style={style}
        >
            <DialogCloseButton
                onClick={() => setOpen(false)}
                style={closeButtonStyle}
            />

            {children}
        </div>
    </div>;
}

export default Dialog;