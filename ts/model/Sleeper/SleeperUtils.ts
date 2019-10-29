function convertSleeperRoster(rosterPositions: string[], numIR: number, numTaxi: number): [number[], number[]] {
    const activeCount = new Map();
    const benchCount = new Map();
    const activeLineupSlots = [];
    const benchSlots = [];
    const active = rosterPositions.filter((slot) => {
        return slot !== "BN";
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
            sleeperStats.push(new SleeperWeekStats(projections[i], stats[i], i + 1));
        }

        return sleeperStats;
    });
}

function findOpponent(teams: SleeperTeamResponse[], rosterId: number, matchupId: number): number {
    let opponentRosterId = -1;
    teams.forEach((team) => {
        if (team.matchup_id === matchupId && team.roster_id !== rosterId) {
            opponentRosterId = team.roster_id;
        }
    });

    return opponentRosterId;
}

function assignSleeperPlayerAttributes(player: SleeperPlayer, playerAttributes: SleeperPlayerLibraryEntry) {
    player.firstName = playerAttributes.first_name;
    player.lastName = playerAttributes.last_name;
    player.position = playerAttributes.position;
    player.eligibleSlots = eligibleSlotMap.get(positionToInt.get(playerAttributes.position));
    player.realTeamID = playerAttributes.team;
    if (playerAttributes.espn_id) {
        player.espnID = playerAttributes.espn_id.toString();
    } else {
        player.espnID = player.playerID;
    }
}
