// rounds given number to closest hundreth
function roundToHundred(x: number): number {
    return Math.round(x * 100) / 100;
}

// rounds given number to closest tenth
function roundToTen(x: number): number {
    return Math.round(x * 10) / 10;
}

function roundToThousand(x: number): number {
    return Math.round(x * 1000) / 1000;
}

// Params: Double
// Returns: Hex, Color for card
function getColor(value: number): string {
    // value from 0 to 1
    const hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,60%)"].join("");
}

function getLightColor(value: number): string {
    // value from 0 to 1
    const hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,95%)"].join("");
}

function getDarkColor(value: number): string {
    // value from 0 to 1
    const hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,47%)"].join("");
}

function getLightCardColor(rank: number, outOf: number) {
    return getLightColor(rank / outOf);
}

function getCardColor(rank: number, outOf: number) {
    return getColor(rank / outOf);
}

function getDarkCardColor(rank: number, outOf: number) {
    return getDarkColor(rank / outOf);
}

function getInverseCardColor(rank: number, outOf: number) {
    return getColor((1 + (outOf - rank)) / outOf);
}
function getInverseDarkCardColor(rank: number, outOf: number) {
    return getDarkColor((1 + (outOf - rank)) / outOf);
}

function getTextColor(rank: number, outOf: number): string {
    const o = rank / outOf;
    if (o < .75) {
        return "black";
    } else {
        return "white";
    }
}

// Returns the suffix of whatever number is input
function ordinal_suffix_of(i: number): string {
    const j = i % 10;
    const k = i % 100;
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

function hexToRGB(hex: string, alpha?: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}
