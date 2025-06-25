import React, { useState } from "react";
import { toast } from "react-toastify";

import TextFieldProps from "./TextFieldProps";
import * as styles from "./TextField.module.css";

function TextField({
    wrapperClassName,
    wrapperStyle,
    className,
    style,
    copyClassName,
    copyStyle,
    placeholder,
    value,
    multiline,
    readOnly,
    disabled,
    copyable,
    copyTooltip,
    copyToast,
    password,
    onChange,
    onClick
}: TextFieldProps) {
    const [ text, setText ] = useState(value || "");

    const sharedProps = {
        className: `${styles.field} ${className}`,
        placeholder,
        style,
        value,
        readOnly,
        disabled
    };

    function copy() {
        navigator.clipboard.writeText(text);

        if (!copyToast) return;

        toast.success(copyToast, {
            position: "bottom-left",
            theme: "dark",
            pauseOnHover: false,
            closeOnClick: true,
            closeButton: false,
            autoClose: 2000,
            pauseOnFocusLoss: false,
            style: { fontFamily: "JetBrains Mono" }
        });
    }

    return <div
        className={`${styles.wrapper} ${wrapperClassName}`}
        style={wrapperStyle}
    >
        {multiline
            ? <textarea
                {...sharedProps}
                onChange={event => {
                    setText(event.target.value);
                    onChange?.(event.target.value);
                }}
                onClick={onClick}
            ></textarea>
            : <input
                {...sharedProps}
                type={password ? "password" : "text"}
                onChange={event => {
                    setText(event.target.value);
                    onChange?.(event.target.value);
                }}
                onClick={onClick}
            />
        }

        {copyable && <div
            className={`${styles.copyWrapper} ${copyClassName}`}
            style={{
                height: `min(${multiline ? "35px" : "100%"}, 100%)`,
                ...copyStyle
            }}
            title={copyTooltip}
            onClick={copy}
        >
            <img src={require("@assets/img/interface/copy.svg")} />
        </div>}
    </div>;
}

export default TextField;