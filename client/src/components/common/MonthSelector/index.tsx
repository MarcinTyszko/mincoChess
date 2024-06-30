import React, { useState } from "react";

import Button from "../Button";

import MonthSelectorProps from "./MonthSelectorProps";
import * as styles from "./MonthSelector.module.css";

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

function MonthSelector({ onMonthChange, allowFuture }: MonthSelectorProps) {
    const [ searchYear, setSearchYear ] = useState<number>(new Date().getFullYear());
    const [ searchMonth, setSearchMonth ] = useState<number>(new Date().getMonth());

    function incrementMonth(offset: number) {
        let newMonth = searchMonth + offset;
        let newYear = searchYear;

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

        setSearchMonth(newMonth);
        setSearchYear(newYear);

        if (!onMonthChange) return;
        onMonthChange(newMonth + 1, newYear);
    }

    return <div className={styles.wrapper}>
        <Button
            colour={"#222222"}
            icon={require("@assets/img/back.svg")}
            options={{
                iconSize: "30px"
            }}
            style={{
                padding: "5px"
            }}
            onClick={() => incrementMonth(-1)}
        />

        <span>
            {monthNames[searchMonth]} {searchYear}
        </span>

        <Button
            colour={"#222222"}
            icon={require("@assets/img/next.svg")}
            options={{
                iconSize: "30px"
            }}
            style={{
                padding: "5px"
            }}
            onClick={() => incrementMonth(1)}
        />
    </div>;
}

export default MonthSelector;