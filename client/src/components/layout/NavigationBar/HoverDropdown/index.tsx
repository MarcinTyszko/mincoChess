import React, { useState } from "react";

import HoverDropdownProps from "./HoverDropdownProps";
import * as styles from "./HoverDropdown.module.css";

function HoverDropdown({
    children,
    dropdownClassName,
    dropdownStyle,
    menuClassName,
    menuStyle,
    icon,
    url,
    options = []
}: HoverDropdownProps) {
    const [ open, setOpen ] = useState(false);

    const dropdown = <div
        className={[
            styles.dropdown,
            open && styles.dropdownActive,
            dropdownClassName
        ].join(" ")}
        style={dropdownStyle}
        onMouseEnter={() => setOpen(true)}
    >
        {icon && <img src={icon} style={{ width: "25px" }} />}

        {children}
    </div>;

    return <div
        className={styles.wrapper}
        style={{ cursor: url ? "pointer" : "default" }}
        onMouseLeave={() => setOpen(false)}
    >
        {url ? <a href={url}>{dropdown}</a> : dropdown}

        {open && <div
            className={`${styles.menu} ${menuClassName}`}
            style={menuStyle}
        >
            {options.map(opt => <a className={styles.item} href={opt.url}>
                {opt.icon && <img src={opt.icon} />}

                {opt.label}
            </a>)}
        </div>}
    </div>;
}

export default HoverDropdown;