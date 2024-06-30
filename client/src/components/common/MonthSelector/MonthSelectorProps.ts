interface MonthSelectorProps {
    onMonthChange?: (month: number, year: number) => void;
    allowFuture?: boolean;
}

export default MonthSelectorProps;