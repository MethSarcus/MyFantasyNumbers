function sortTableByRecord(x, y) {
    const xWins = parseInt(x.split("-")[0], 10);
    const xLosses = parseInt(x.split("-")[1], 10);
    const yWins = parseInt(y.split("-")[0], 10);
    const yLosses = parseInt(x.split("-")[1], 10);

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

function renderTableOrdinalNumber(data, type) {
    if (type === "display") {
        data = ordinal_suffix_of(data);
    }
    return data;
}

function renderTableDifferenceNumber(data, type) {
    if (type === "display" && parseInt(data, 10) > 0) {
        data = "+" + data;
    }
    return data;
}
