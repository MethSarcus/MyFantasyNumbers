function convertSleeperRoster(rosterPositions: string[], numIR: number, numTaxi: number): [number[], number[]] {
    const activeCount = new Map();
    const benchCount = new Map();
    const activeLineupSlots = [];
    const benchSlots = [];
    const active = rosterPositions.filter((it) => {
        return it = "BN";
    }).map((slot) => positionToInt.get(slot));
    active.forEach((slot) => {
        if (activeCount.has(slot)) {
            const newCount = activeCount.get(slot) + 1;
            activeCount.set(slot, newCount);
        } else {
            activeCount.set(slot, 1);
        }
    });

    const bench = rosterPositions.filter((it) => {
        return it === "BN";
    }).map((slot) => positionToInt.get(slot));
    for (let i = 0; i < numIR; i++) {
        bench.push(positionToInt.get("IR"));
    }
    for (let i = 0; i < numTaxi; i++) {
        bench.push(positionToInt.get("TAXI"));
    }
    bench.forEach((slot) => {
        if (benchCount.has(slot)) {
            const newCount = benchCount.get(slot) + 1;
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

function makeSleeperPlayers(players: string[]): SleeperPlayer[] {
    const sleeperPlayers = [];
    players.forEach((player) => {
        sleeperPlayers.push(player);
    });
    return sleeperPlayers;
}

function getSleeperWeekStats(numWeeks: number): Promise<any> {
    const statPromises = [];
    for (let i = 1; i <= numWeeks; i++) {
        statPromises.push(makeRequest("https://api.sleeper.app/v1/stats/nfl/regular/2019/" + i));
    }

    const projectionPromises = [];
    for (let i = 1; i <= numWeeks; i++) {
        projectionPromises.push(makeRequest("https://api.sleeper.app/v1/projections/nfl/regular/2019/" + i));
    }
    const allPromises = statPromises.concat(projectionPromises);
    return Promise.all(allPromises).then((result) => {
        const sleeperStats = [];
        const stats = result.slice(0, statPromises.length).map((obj) => {
            return obj.response;
        });
        const projections = result.slice(statPromises.length, allPromises.length).map((obj) => {
            return obj.response;
        });

        for (let i = 0; i < stats.length; i++) {
            sleeperStats.push(new Sleeper_Week_Stats(projections[i], stats[i], i + 1));
        }

        return sleeperStats;
    });
}

function assignSleeperPlayerAttributes(player: SleeperPlayer, playerAttributes: SleeperPlayerLibraryEntry) {
    player.firstName = playerAttributes.first_name;
    player.lastName = playerAttributes.last_name;
    player.position = playerAttributes.position;
    player.playerID = player.playerID;
    player.eligibleSlots = eligibleSlotMap.get(positionToInt.get(playerAttributes.position));
    player.realTeamID = playerAttributes.team;
    player.espnID = playerAttributes.espn_id;
}

const eligibleSlotMap = new Map([
    [0, [0, 1, 7, 20, 21]],
    [1, [1, 7, 20, 21]],
    [2, [2, 3, 7, 20, 21, 23]],
    [4, [4, 3, 5, 7, 20, 21, 23]],
    [6, [6, 5, 7, 20, 21, 23]],
    [8, [8, 15, 20, 21]],
    [9, [9, 15, 20, 21]],
    [10, [10, 15, 20, 21]],
    [11, [11, 15, 20, 21]],
    [12, [12, 15, 20, 21]],
    [13, [13, 15, 20, 21]],
    [14, [14, 15, 20, 21]],
    [16, [16, 20]],
    [17, [17, 20, 21]],
    [18, [18, 20, 21]],
    [19, [19, 20]],
]);

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
    [88, "TAXI"],
]);

const positionToInt = new Map([
    ["QB", 0],
    ["TQB", 1],
    ["RB", 2],
    ["RB/WR", 3],
    ["WR", 4],
    ["WR/TE", 5],
    ["TE", 6],
    ["SUPER_FLEX", 7],
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
    ["TAXI", 88],
]);

function findOpponent(teams: TeamResponse[], rosterId: number, matchupId: number): number {
    let opponentRosterId = -1;
    teams.forEach((team) => {
        if (team.matchup_id === matchupId && team.roster_id !== rosterId) {
            opponentRosterId = team.roster_id;
        }
    });

    return opponentRosterId;
}
