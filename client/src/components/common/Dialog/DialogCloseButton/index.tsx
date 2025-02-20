import React from "react";

import Button from "@components/common/Button";

import DialogCloseButtonProps from "./DialogCloseButtonProps";

function DialogCloseButton({ onClick, style }: DialogCloseButtonProps) {
    return <Button
        icon={require("@assets/img/close.svg")}
        iconSize="30px"
        style={{
            ...style,
            backgroundColor: "#222",
            padding: "5px",
            position: "absolute",
            top: "5px",
            right: "5px"
        }}
        onClick={onClick}
    />;
}

export default DialogCloseButton;