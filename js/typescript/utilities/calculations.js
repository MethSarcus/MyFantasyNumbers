// rounds given number to closest hundreth
function roundToHundred(x) {
    return Math.round(x * 100) / 100;
}
// rounds given number to closest tenth
function roundToTen(x) {
    return Math.round(x * 10) / 10;
}
// Params: Double
// Returns: Hex, Color for card
function getColor(value) {
    // value from 0 to 1
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}
function getCardColor(rank, outOf) {
    return getColor(rank / outOf);
}
function getInverseCardColor(rank, outOf) {
    return getColor((1 + (outOf - rank)) / outOf);
}
function getTextColor(rank, outOf) {
    var o = rank / outOf;
    if (o < .75) {
        return "black";
    }
    else {
        return "white";
    }
}
// Returns the suffix of whatever number is input
function ordinal_suffix_of(i) {
    var j = i % 10;
    var k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}
//# sourceMappingURL=calculations.js.map