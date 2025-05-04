import React from "react";
import Select, { components } from "react-select";

import {
    BaseDropdownOption,
    DropdownSettingProps
} from "./DropdownSettingProps";
import * as styles from "./DropdownSetting.module.css";

const defaultStyles = {
    dropdown: {
        width: "200px",
        backgroundColor: "var(--ui-shade-5)",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        transitionDuration: "0.3s"
    },
    menu: {
        width: "200px",
        zIndex: 100000,
        backgroundColor: "var(--ui-shade-4)",
        color: "white"
    },
    option: {
        backgroundColor: "rgba(0, 0, 0, 0)",
        transitionDuration: "0.3s"
    }
};

function DropdownSetting<Option extends BaseDropdownOption>(
    props: DropdownSettingProps<Option>
) {
    function getMenuOffset() {
        const dropdownWidth = (
            props.dropdownStyle?.width || defaultStyles.dropdown.width
        );
        const menuWidth = props.menuStyle?.width || defaultStyles.menu.width;

        if (props.menuAlignment == "left") {
            return "0px";
        } else if (props.menuAlignment == "center") {
            return `calc((${dropdownWidth} / 2) - (${menuWidth} / 2))`;
        } else {
            return `calc((${menuWidth} * -1) + ${dropdownWidth})`;
        }
    }

    return <Select
        options={props.options}
        getOptionLabel={option => option.label}
        defaultValue={props.defaultValue}
        onChange={value => props.onSelect?.(value ?? undefined)}
        isSearchable={props.searchable || false}
        styles={{
            control: baseStyles => ({
                ...baseStyles,
                ...defaultStyles.dropdown,
                ...props.dropdownStyle
            }),
            dropdownIndicator: baseStyles => ({
                ...baseStyles,
                ...props.dropdownArrowStyle
            }),
            singleValue: baseStyles => ({
                ...baseStyles,
                display: "flex",
                alignItems: "center",
                color: "white",
                ...props.dropdownLabelStyle
            }),
            menu: baseStyles => ({
                ...baseStyles,
                ...defaultStyles.menu,
                left: getMenuOffset(),
                ...props.menuStyle
            }),
            option: (baseStyles) => ({
                ...baseStyles,
                ...defaultStyles.option,
                ...props.optionStyle
            })
        }}
        components={{
            Control: controlProps => <components.Control
                {...controlProps}
                className={props.dropdownClassName}
            />,
            DropdownIndicator: props.dropdownArrowStyle?.display == "none"
                ? null
                : indicatorProps => <components.DropdownIndicator
                    {...indicatorProps}
                    className={props.dropdownArrowClassName}
                />,
            SingleValue: selectedValueProps => (
                <components.SingleValue
                    {...selectedValueProps}
                    className={props.dropdownLabelClassName}
                >
                    {props.dropdownLabelRenderer
                        ? props.dropdownLabelRenderer?.(selectedValueProps.data)
                        : selectedValueProps.data.label
                    }
                </components.SingleValue>
            ),
            Menu: menuProps => <components.Menu
                {...menuProps}
                className={props.menuClassName}
            />,
            Option: optionProps => <components.Option
                {...optionProps}
                className={`${styles.optionDefault} ${props.optionClassName}`}
            />
        }}
        maxMenuHeight={400}
    />;
}

export default DropdownSetting;