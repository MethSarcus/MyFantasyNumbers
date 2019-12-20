function sortTableRecord(data: string, type: string, row: any, settings: any) {
    if (type === "sort") {
        return parseInt(data.split("-")[0]) / parseInt(data.split("-")[1]);
    }
    return data;
}

function renderTablePercentage(data: string, type: string) {
    if (type === "display") {
        if (parseFloat(data) === 0 || parseFloat(data) === 1) {
            return data + ".00%";
        } else {
            return data + "%";
        }
    } else {
        return data;
    }
}

function renderTableOrdinalNumber(data: string, type: string) {
    if (type === "display") {
        data = ordinal_suffix_of(parseInt(data, 10));
    }
    return data;
}

function renderTableDifferenceNumber(data: string, type: string) {
    if (type === "display" && parseInt(data, 10) > 0) {
        data = "+" + data;
    }
    return data;
}
