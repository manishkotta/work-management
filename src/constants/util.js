export function getDateString(date) {
    if (!date) return "";
    if (typeof date !== Date) {
        date = new Date(date);
    }
    if (date === "Invalid Date") return "";
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

export function transformWorkItemGroupToSpreadSheetFormat(columns, values) {
    var spreadSheetGroup = [];
    if (values && values.length > 0) {
        let firstItem = values[0];
        columns = Object.keys(firstItem);
        spreadSheetGroup = values.map(s => {
            return Object.values(s);
        });
        spreadSheetGroup.splice(0, 0, columns);
    }
    return spreadSheetGroup;
}

export function getValidDate(date) {
    if (typeof date === Date) {
        return { date: date, isValid: true };
    }
    else if (typeof date === 'string' && typeof new Date(date) === Date) {
        return { date: date, isValid: true };
    }
    return { date: "", isValid: false };;
}