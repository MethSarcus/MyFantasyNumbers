function convertSleeperRoster(rosterPositions: string[], numIR: number, numTaxi: number): [number[], number[]]{
    var activeCount = new Map();
    var benchCount = new Map();
    var activeLineupSlots = [];
    var benchSlots = [];
    console.log(rosterPositions);
    var active = rosterPositions.filter(it => {
        return it != "BN";
    }).map(slot => positionToInt.get(slot));
    active.forEach(slot => {
        if (activeCount.has(slot)) {
            let newCount = activeCount.get(slot) + 1;
            activeCount.set(slot, newCount);
        } else {
            activeCount.set(slot, 1);
        }
    });

    var bench = rosterPositions.filter((it) => {
        return it == "BN";
    }).map(slot => positionToInt.get(slot));
    for(var i = 0; i < numIR; i++) {
        bench.push(positionToInt.get("IR"));
    }
    for(var i = 0; i < numTaxi; i++) {
        bench.push(positionToInt.get("TAXI"));
    }
    bench.forEach(slot => {
        if (benchCount.has(slot)) {
            let newCount = benchCount.get(slot) + 1;
            benchCount.set(slot, newCount);
        } else {
            benchCount.set(slot, 1);
        }
    });

    activeCount.forEach((value: number, key: number) => {
        activeLineupSlots.push([key, value]);
    });
    benchCount.forEach((value: number, key: number) => {
        benchSlots.push([key, value]);
    });
    

    return [activeLineupSlots, benchSlots];
}

const intToPosition = new Map([
    [0, "QB"],
    [1, "TQB"],
    [2, "RB"],
    [3, "RB/WR"],
    [4, "WR"],
    [5, "WR/TE"],
    [6, "TE"],
    [7, "OP"],
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
    [88, "TAXI"]
]);

const positionToInt = new Map([
    ["QB", 0],
    ["TQB", 1],
    ["RB", 2],
    ["RB/WR", 3],
    ["WR", 4],
    ["WR/TE", 5],
    ["TE", 6],
    ["OP", 7],
    ["DT", 8],
    ["DE", 9],
    ["LB", 10],
    ["DL", 11],
    ["CB", 12],
    ["S", 13],
    ["DB", 14],
    ["DP", 15],
    ["DEF", 16],
    ["K", 17],
    ["P", 18],
    ["HC", 19],
    ["BN", 20],
    ["IR", 21],
    ["FLEX", 23],
    ["TAXI", 88]
]);
