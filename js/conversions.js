//Params: H, S, and L
//Returns: rgb
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function getPosition(eligibleSlots) {
    if (eligibleSlots[0] == 0) {
        return "QB";
    } else if (eligibleSlots[0] == 2) {
        return "RB";
    } else if (eligibleSlots[0] == 3) {
        return "WR";
    } else if (eligibleSlots[0] == 16) {
        return "D/ST";
    } else if (eligibleSlots[0] == 17) {
        return "K";
    } else if (eligibleSlots[0] == 5) {
        return "TE";
    }
}

function getLineupSlot(lineupSlotID) {
    if (lineupSlotID == 0) {
        return "QB";
    } else if (lineupSlotID == 2) {
        return "RB";
    } else if (lineupSlotID == 23) {
        return "FLEX";
    } else if (lineupSlotID == 20) {
        return "BENCH";
    } else if (lineupSlotID == 21) {
        return "IR";
    } else if (lineupSlotID == 4) {
        return "WR";
    } else if (lineupSlotID == 16) {
        return "D/ST";
    } else if (lineupSlotID == 17) {
        return "K";
    } else if (lineupSlotID == 6) {
        return "TE";
    }
}


//Params: Int, team ID
//Returns: String, Team Abbreviation
function getRealTeamInitials(realteamID) {
    var team;
    //console.log(realteamID);
    switch (realteamID) {
        case 1:
            team = "Atl";
            break;
        case 2:
            team = "Buf";
            break;
        case 3:
            team = "Chi";
            break;
        case 4:
            team = "Cin";
            break;
        case 5:
            team = "Cle";
            break;
        case 6:
            team = "Dal";
            break;
        case 7:
            team = "Den";
            break;
        case 8:
            team = "Det";
            break;
        case 9:
            team = "GB";
            break;
        case 10:
            team = "Ten";
            break;
        case 11:
            team = "Ind";
            break;
        case 12:
            team = "KC";
            break;
        case 13:
            team = "Oak";
            break;
        case 14:
            team = "Lar";
            break;
        case 15:
            team = "Mia";
            break;
        case 16:
            team = "Min";
            break;
        case 17:
            team = "NE";
            break;
        case 18:
            team = "NO";
            break;
        case 19:
            team = "NYG";
            break;
        case 20:
            team = "NYJ";
            break;
        case 21:
            team = "Phi";
            break;
        case 22:
            team = "Ari";
            break;
        case 23:
            team = "Pit";
            break;
        case 24:
            team = "LAC";
            break;
        case 25:
            team = "SF";
            break;
        case 26:
            team = "Sea";
            break;
        case 27:
            team = "TB";
            break;
        case 28:
            team = "Was";
            break;
        case 29:
            team = "Car";
            break;
        case 30:
            team = "Jax";
            break;
        case 33:
            team = "Bal";
            break;
        case 34:
            team = "Hou";
            break;
    }
    return team;
}