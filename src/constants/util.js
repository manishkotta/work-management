export function getDateString(date) {
    if (!date) return "";
    if (typeof date !== Date) {
        date = new Date(date);
    }
    if(date === "Invalid Date") return "";
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}