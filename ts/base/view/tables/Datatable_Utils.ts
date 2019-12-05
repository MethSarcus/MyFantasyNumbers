function sortTableByRecord(x: string, y: string) {
    const xWins = parseInt(x.split("-")[0], 10);
    const xLosses = parseInt(x.split("-")[1], 10);
    const yWins = parseInt(y.split("-")[0], 10);
    const yLosses = parseInt(y.split("-")[1], 10);

    if (xWins > yWins) {
        return 1;
    } else if (xWins > yWins) {
        return -1;
    } else {
        if (xLosses < yLosses) {
            return 1;
        } else {
            return -1;
        }
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
