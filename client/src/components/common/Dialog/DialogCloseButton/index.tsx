import React from "react";

import Button from "@components/common/Button";

import DialogCloseButtonProps from "./DialogCloseButtonProps";
import * as styles from "./DialogCloseButton.module.css";

function DialogCloseButton({ onClick, style }: DialogCloseButtonProps) {
    return <Button
        className={styles.closeButton}
        icon={require("@assets/img/close.svg")}
        iconSize="30px"
        style={style}
        onClick={onClick}
    />;
}

export default DialogCloseButton;