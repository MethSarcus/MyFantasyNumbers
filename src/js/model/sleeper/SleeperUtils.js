function convertSleeperRoster(rosterPositions, numIR, numTaxi) {
    var activeCount = new Map();
    var benchCount = new Map();
    var activeLineupSlots = new Array();
    var benchSlots = new Array();
    var active = rosterPositions.filter(function (slot) {
        return slot !== "BN";
    }).map(function (slot) { return positionToInt.get(slot); });
    active.forEach(function (slot) {
        if (activeCount.has(slot)) {
            var newCount = activeCount.get(slot) + 1;
            activeCount.set(slot, newCount);
        }
        else {
            activeCount.set(slot, 1);
        }
    });
    var bench = rosterPositions.filter(function (it) {
        return it === "BN";
    }).map(function (slot) { return positionToInt.get(slot); });
    for (var i = 0; i < numIR; i++) {
        bench.push(positionToInt.get("IR"));
    }
    for (var i = 0; i < numTaxi; i++) {
        bench.push(positionToInt.get("TAXI"));
    }
    bench.forEach(function (slot) {
        if (benchCount.has(slot)) {
            var newCount = benchCount.get(slot) + 1;
            benchCount.set(slot, newCount);
        }
        else {
            benchCount.set(slot, 1);
        }
    });
    activeCount.forEach(function (value, key) {
        activeLineupSlots.push([key, value]);
    });
    benchCount.forEach(function (value, key) {
        benchSlots.push([key, value]);
    });
    return [activeLineupSlots, benchSlots];
}
function makeSleeperPlayers(players) {
    var sleeperPlayers = [];
    players.forEach(function (player) {
        sleeperPlayers.push(player);
    });
    return sleeperPlayers;
}
function getSleeperWeekStats(numWeeks) {
    var statPromises = [];
    for (var i = 1; i <= numWeeks; i++) {
        statPromises.push(makeRequest("https://api.sleeper.app/v1/stats/nfl/regular/2019/" + i));
    }
    var projectionPromises = [];
    for (var i = 1; i <= numWeeks; i++) {
        projectionPromises.push(makeRequest("https://api.sleeper.app/v1/projections/nfl/regular/2019/" + i));
    }
    var allPromises = statPromises.concat(projectionPromises);
    return Promise.all(allPromises).then(function (result) {
        var sleeperStats = [];
        var stats = result.slice(0, statPromises.length).map(function (obj) {
            return obj.response;
        });
        var projections = result.slice(statPromises.length, allPromises.length).map(function (obj) {
            return obj.response;
        });
        for (var i = 0; i < stats.length; i++) {
            sleeperStats.push(new SleeperWeekStats(projections[i], stats[i], i + 1));
        }
        return sleeperStats;
    });
}
function findOpponent(teams, rosterId, matchupId) {
    var opponentRosterId = -1;
    teams.forEach(function (team) {
        if (team.matchup_id === matchupId && team.roster_id !== rosterId) {
            opponentRosterId = team.roster_id;
        }
    });
    return opponentRosterId;
}
function assignSleeperPlayerAttributes(player, playerAttributes) {
    player.firstName = playerAttributes.first_name;
    player.lastName = playerAttributes.last_name;
    player.position = playerAttributes.position;
    player.eligibleSlots = eligibleSlotMap.get(positionToInt.get(playerAttributes.position));
    player.realTeamID = playerAttributes.team;
    if (playerAttributes.espn_id) {
        player.espnID = playerAttributes.espn_id.toString();
    }
    else {
        player.espnID = player.playerID;
    }
}
//# sourceMappingURL=SleeperUtils.js.map