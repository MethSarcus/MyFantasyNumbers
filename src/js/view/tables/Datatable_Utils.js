function sortTableByRecord(x, y) {
    var xWins = parseInt(x.split("-")[0], 10);
    var xLosses = parseInt(x.split("-")[1], 10);
    var yWins = parseInt(y.split("-")[0], 10);
    var yLosses = parseInt(x.split("-")[1], 10);
    if (xWins > yWins) {
        return 1;
    }
    else if (xWins > yWins) {
        return -1;
    }
    else {
        if (xLosses < yLosses) {
            return 1;
        }
        else {
            return -1;
        }
    }
}
function renderTableOrdinalNumber(data, type) {
    if (type === "display") {
        data = ordinal_suffix_of(parseInt(data, 10));
    }
    return data;
}
function renderTableDifferenceNumber(data, type) {
    if (type === "display" && parseInt(data, 10) > 0) {
        data = "+" + data;
    }
    return data;
}
//# sourceMappingURL=Datatable_Utils.js.map