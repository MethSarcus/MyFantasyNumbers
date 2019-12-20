const eligibleSlotMap = new Map([
    [0, [0, 1, 7, 20, 21, 88]],
    [1, [1, 7, 20, 21, 88]],
    [2, [2, 3, 7, 20, 21, 23, 88]],
    [4, [4, 3, 5, 7, 20, 21, 23, 88]],
    [6, [6, 5, 7, 20, 21, 23, 88]],
    [8, [8, 15, 20, 21, 88]],
    [9, [9, 15, 20, 21, 88]],
    [10, [10, 15, 20, 21, 88]],
    [11, [11, 15, 20, 21, 88]],
    [12, [12, 15, 20, 21, 88]],
    [13, [13, 15, 20, 21, 88]],
    [14, [14, 15, 20, 21, 88]],
    [16, [16, 20]],
    [17, [17, 20, 21, 88]],
    [18, [18, 20, 21, 88]],
    [19, [19, 20]],
    [26, [26, 15, 8, 15, 20, 21, 88]],
    [27, [27, 15, 8, 15, 20, 21, 88]],
    [28, [28, 15, 8, 15, 20, 21, 88]],
    [29, [29, 15, 8, 15, 20, 21, 88]],
    [30, [28, 15, 8, 15, 20, 21, 88]],
]);

// Defense: 8-14 26-30

const intToPosition = new Map([
    [0, "QB"],
    [1, "TQB"],
    [2, "RB"],
    [3, "RB/WR"],
    [4, "WR"],
    [5, "WR/TE"],
    [6, "TE"],
    [7, "SUPER_FLEX"],
    [8, "DT"],
    [9, "DE"],
    [10, "LB"],
    [11, "DL"],
    [12, "CB"],
    [13, "S"],
    [14, "DB"],
    [15, "DP"],
    [16, "DEF"],
    [17, "K"],
    [18, "P"],
    [19, "HC"],
    [20, "BN"],
    [21, "IR"],
    [23, "FLEX"],
    [25, "???"],
    [26, "SS"],
    [27, "FS"],
    [28, "NT"],
    [29, "OLB"],
    [30, "ILB"],
    [88, "TAXI"],
    [-1, "EMPTY"],
]);

const positionToInt = new Map([
    ["QB", 0],
    ["TQB", 1],
    ["RB", 2],
    ["FB", 2],
    ["RB/WR", 3],
    ["WR", 4],
    ["WR/TE", 5],
    ["REC_FLEX", 5],
    ["TE", 6],
    ["SUPER_FLEX", 7],
    ["OP", 7],
    ["DT", 8],
    ["NT", 28],
    ["DE", 9],
    ["OLB", 29],
    ["ILB", 30],
    ["LB", 10],
    ["DL", 11],
    ["CB", 12],
    ["S", 13],
    ["SS", 26],
    ["FS", 27],
    ["DB", 14],
    ["DP", 15],
    ["DEF", 16],
    ["K", 17],
    ["P", 18],
    ["HC", 19],
    ["BN", 20],
    ["IR", 21],
    ["FLEX", 23],
    ["TAXI", 88],
    ["???", 25],
    ["EMPTY", -1],
]);

const SleeperFlexFillPositions = new Map([
    ["SUPER_FLEX", ["QB", "RB", "WR", "TE"]],
    ["FLEX", ["RB", "WR", "TE"]],
    ["REC_FLEX", ["WR", "TE"]],
    ["WRRB_FLEX", ["WR", "RB"]],
    ["IDP_FLEX", ["DL", "LB", "DB"]],
]);

function getPosition(eligibleSlots: number[]): string {
    let slotNum = eligibleSlots[0];
    let i = 0;
    while (slotNum.toString() === "25" || slotNum.toString() === "23" || slotNum.toString() === "3" || slotNum.toString() === "5" || slotNum.toString() === "7" ||  slotNum.toString() === "15") {
        i += 1;
        slotNum = eligibleSlots[i];
    }
    return intToPosition.get(slotNum);
}

function getRealTeamInitials(realteamID: string) {
    if (realteamID == null) {
        return "FA";
    }

    let team = realteamID.toString();
    switch (team) {
        case "1":
            team = "Atl";
            break;
        case "2":
            team = "Buf";
            break;
        case "3":
            team = "Chi";
            break;
        case "4":
            team = "Cin";
            break;
        case "5":
            team = "Cle";
            break;
        case "6":
            team = "Dal";
            break;
        case "7":
            team = "Den";
            break;
        case "8":
            team = "Det";
            break;
        case "9":
            team = "GB";
            break;
        case "10":
            team = "Ten";
            break;
        case "11":
            team = "Ind";
            break;
        case "12":
            team = "KC";
            break;
        case "13":
            team = "Oak";
            break;
        case "14":
            team = "Lar";
            break;
        case "15":
            team = "Mia";
            break;
        case "16":
            team = "Min";
            break;
        case "17":
            team = "NE";
            break;
        case "18":
            team = "NO";
            break;
        case "19":
            team = "NYG";
            break;
        case "20":
            team = "NYJ";
            break;
        case "21":
            team = "Phi";
            break;
        case "22":
            team = "Ari";
            break;
        case "23":
            team = "Pit";
            break;
        case "24":
            team = "LAC";
            break;
        case "25":
            team = "SF";
            break;
        case "26":
            team = "Sea";
            break;
        case "27":
            team = "TB";
            break;
        case "28":
            team = "Wsh";
            break;
        case "29":
            team = "Car";
            break;
        case "30":
            team = "Jax";
            break;
        case "33":
            team = "Bal";
            break;
        case "34":
            team = "Hou";
            break;
        case "-1":
            team = "None";
            break;
    }

    return team;
}
