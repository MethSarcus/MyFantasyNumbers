function getOptimalLineup(activeLineupSlots, players) {
    var optimalLineup = [];
    activeLineupSlots.forEach(function (slot) {
        optimalLineup = optimalLineup.concat(getHighestPlayersForSlot(slot[0], slot[1], players, optimalLineup));
    });
    return optimalLineup;
}
function getHighestPlayersForSlot(slotID, numPlayers, players, takenPlayers) {
    var eligibleSortedPlayers = players.filter(function (player) {
        return (player.eligibleSlots.includes(slotID) && !takenPlayers.includes(player));
    }).sort(function (a, b) {
        return b.score - a.score;
    });
    if (eligibleSortedPlayers.length >= numPlayers) {
        return eligibleSortedPlayers.slice(0, numPlayers);
    }
    else {
        while (eligibleSortedPlayers.length <= numPlayers) {
            eligibleSortedPlayers.push(new EmptySlot(slotID));
        }
        return eligibleSortedPlayers.slice(0, numPlayers);
    }
}
function getOptimalProjectedLineup(activeLineupSlots, players) {
    var optimalLineup = [];
    activeLineupSlots.forEach(function (slot) {
        optimalLineup = optimalLineup.concat(getHighestProjectedPlayersForSlot(slot[0], slot[1], players, optimalLineup));
    });
    return optimalLineup;
}
function getHighestProjectedPlayersForSlot(slotID, numPlayers, players, takenPlayers) {
    var eligibleSortedPlayers = players.filter(function (player) {
        return (player.eligibleSlots.includes(slotID) && !takenPlayers.includes(player));
    }).sort(function (a, b) {
        return b.projectedScore - a.projectedScore;
    });
    if (eligibleSortedPlayers.length >= numPlayers) {
        return eligibleSortedPlayers.slice(0, numPlayers);
    }
    else {
        while (eligibleSortedPlayers.length <= numPlayers) {
            eligibleSortedPlayers.push(new EmptySlot(slotID));
        }
        return eligibleSortedPlayers.slice(0, numPlayers);
    }
}
//# sourceMappingURL=lineupCalculations.js.map