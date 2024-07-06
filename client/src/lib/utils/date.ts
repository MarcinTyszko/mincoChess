export const monthNames = [
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

export function padDateNumber(month: number) {
    const monthString = month.toString();
    return monthString.length > 1 ? monthString : "0" + monthString;
}

export function getMonthLength(month: number) {
    const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const date = new Date();
    if (date.getFullYear() % 4 == 0) {
        monthLengths[1] = 29;
    }

    return monthLengths[month];
}