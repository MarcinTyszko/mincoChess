import React, { useState } from "react";

import { monthNames } from "wintrchess";
import Button from "../Button";

import MonthSelectorProps from "./MonthSelectorProps";
import * as styles from "./MonthSelector.module.css";

function MonthSelector({ 
    onMonthChange, 
    allowFuture, 
    locked
}: MonthSelectorProps) {
    const [ year, setYear ] = useState(new Date().getFullYear());
    const [ month, setMonth ] = useState(new Date().getMonth());

    function incrementMonth(offset: number) {
        if (locked) return;

        let newMonth = month + offset;
        let newYear = year;

        const currentDate = new Date();
        if (
            newMonth > currentDate.getMonth() 
            && newYear >= currentDate.getFullYear()
            && !allowFuture
        ) return;

        if (newMonth >= 12) {
            newYear += Math.floor(newMonth / 12);
            newMonth %= 12;
        } else if (newMonth < 0) {
            newYear += Math.floor(newMonth / 12);
            newMonth = 12 + newMonth;
        }

        setMonth(newMonth);
        setYear(newYear);

        onMonthChange?.(newMonth + 1, newYear);
    }

    return <div className={styles.wrapper}>
        <Button
            icon={require("@assets/img/back.svg")}
            iconSize="30px"
            style={{
                backgroundColor: "#222",
                padding: "5px"
            }}
            onClick={() => incrementMonth(-1)}
        />

        <span>{monthNames[month]} {year}</span>

        <Button
            icon={require("@assets/img/next.svg")}
            iconSize="30px"
            style={{
                backgroundColor: "#222",
                padding: "5px"
            }}
            onClick={() => incrementMonth(1)}
        />
    </div>;
}

export default MonthSelector;