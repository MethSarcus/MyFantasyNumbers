function roundToHundred(x) {
    return Math.round(x * 100) / 100;
}
function roundToTen(x) {
    return Math.round(x * 10) / 10;
}
function getColor(value) {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,60%)"].join("");
}
function getLightColor(value) {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,95%)"].join("");
}
function getDarkColor(value) {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,47%)"].join("");
}
function getLightCardColor(rank, outOf) {
    return getLightColor(rank / outOf);
}
function getCardColor(rank, outOf) {
    return getColor(rank / outOf);
}
function getDarkCardColor(rank, outOf) {
    return getDarkColor(rank / outOf);
}
function getInverseCardColor(rank, outOf) {
    return getColor((1 + (outOf - rank)) / outOf);
}
function getInverseDarkCardColor(rank, outOf) {
    return getDarkColor((1 + (outOf - rank)) / outOf);
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