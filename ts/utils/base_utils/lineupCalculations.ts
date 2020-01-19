function getSleeperOptimalLineup(lineupSlots: string[][], players: SleeperPlayer[], includeTaxi: boolean): Array<[string[], SleeperPlayer]> {
    const flexSlots: string[][] = [];
    const positionSlots: string[][] = [];
    const optimalLineup: Array<[string[], SleeperPlayer]> = [];
    lineupSlots.forEach((acceptablePositions) => {
        if (acceptablePositions.length > 1) {
            flexSlots.push(acceptablePositions);
        } else {
            positionSlots.push(acceptablePositions);
        }
    });

    positionSlots.forEach((positionSlot) => {
        const validPlayers = getSleeperValidSlotPlayers(positionSlot, players, optimalLineup, includeTaxi);
        validPlayers.sort((p1, p2) => p2.score - p1.score);
        optimalLineup.push([positionSlot, validPlayers[0]]);
    });

    return optimalLineup;
}

function getSleeperValidSlotPlayers(slotPositions: string[], players: SleeperPlayer[], optimalLineup: Array<[string[], SleeperPlayer]>, includesTaxi: boolean): SleeperPlayer[] {
    const validPlayers = [];
    players.forEach((player: SleeperPlayer) => {
        if (slotPositions.includes(player.position) && !lineupHasPlayer(player, optimalLineup)) {
            if (includesTaxi) {
                validPlayers.push(player);
            } else {
                if (player.lineupSlotID !== 88) {
                    validPlayers.push(player);
                }
            }
        }
    });
    if (validPlayers.length === 0) {
        validPlayers.push(new EmptySleeperSlot(slotPositions));
    }

    return validPlayers;
}

function lineupHasPlayer(player: SleeperPlayer, optimalLineup: Array<[string[], SleeperPlayer]>): boolean {
    let hasPlayer = false;
    optimalLineup.forEach((lineupSlot) => {
        if (lineupSlot[1].playerID === player.playerID) {
            hasPlayer = true;
        }
    });
    return hasPlayer;
}

function getOptimalLineup(activeLineupSlots: number[][], players: Player[], excludedLineupSlots: number[], excludedPositionSlots: number[]): Player[] {
    let optimalLineup: Player[] = [];
    activeLineupSlots.forEach((slot) => {
        optimalLineup = optimalLineup.concat(getHighestPlayersForSlot(slot[0], slot[1], players, optimalLineup, excludedLineupSlots, excludedPositionSlots));
    });
    return optimalLineup;
}

function getOptimalLineupBench(players: Player[], excludedLineupSlots: number[], excludedPositionSlots: number[], benchSlots: number): Player[] {
        return getHighestPlayersForSlotBench(20, benchSlots, players, [], excludedLineupSlots, excludedPositionSlots);
}

function getHighestPlayersForSlot(slotID: number, numPlayers: number, players: Player[], takenPlayers: Player[], excludedLineupSlots: number[], excludedPositionSlots: number[]): Player[] {
    // Filter players who have already been included or who are not eligible for the slot or who have scored less than 0 since an empty slot would be a better play
    const eligibleSortedPlayers = players.filter((player) => {
        return (player.eligibleSlots.includes(slotID) && !takenPlayers.includes(player) && !excludedLineupSlots.includes(player.lineupSlotID) && !excludedPositionSlots.includes(positionToInt.get(player.position)));
    }).sort((a, b) => {
        return b.score - a.score;
    });
    if (eligibleSortedPlayers.length >= numPlayers) {
        return eligibleSortedPlayers.slice(0, numPlayers);
    } else {
        while (eligibleSortedPlayers.length <= numPlayers) {
            eligibleSortedPlayers.push(new EmptySlot(slotID));
        }
        return eligibleSortedPlayers.slice(0, numPlayers);
    }
}

function getHighestPlayersForSlotBench(slotID: number, numPlayers: number, players: Player[], takenPlayers: Player[], excludedLineupSlots: number[], excludedPositionSlots: number[]): Player[] {
    // Filter players who have already been included or who are not eligible for the slot or who have scored less than 0 since an empty slot would be a better play
    let eligibleSortedPlayers = players.filter((player) => {
        return (player.eligibleSlots.includes(slotID) && !takenPlayers.includes(player) && !excludedLineupSlots.includes(player.lineupSlotID) && !excludedPositionSlots.includes(positionToInt.get(player.position)));
    }).sort((a, b) => {
        return b.score - a.score;
    });
    if (eligibleSortedPlayers.length >= numPlayers) {
        eligibleSortedPlayers = eligibleSortedPlayers.slice(0, numPlayers);
    } else {
        while (eligibleSortedPlayers.length <= numPlayers) {
            eligibleSortedPlayers.push(new EmptySlot(slotID));
        }
        eligibleSortedPlayers = eligibleSortedPlayers.slice(0, numPlayers);
    }
    return players.filter((player) => {
        return !eligibleSortedPlayers.includes(player);
    });
}

function getOptimalProjectedLineup(activeLineupSlots: number[][], players: Player[], excludedLineupSlots: number[], excludedPositions: number[]): Player[] {
    let optimalLineup: Player[] = [];
    activeLineupSlots.forEach((slot) => {
        optimalLineup = optimalLineup.concat(getHighestProjectedPlayersForSlot(slot[0], slot[1], players, optimalLineup, excludedLineupSlots, excludedPositions));
    });
    return optimalLineup;
}

function getOptimalProjectedLineupBench(activeLineupSlots: number[][], players: Player[], excludedLineupSlots: number[], excludedPositions: number[]): Player[] {
    let optimalLineupBench: Player[] = [];
    activeLineupSlots.forEach((slot) => {
        optimalLineupBench = optimalLineupBench.concat(getHighestProjectedPlayersForSlot(slot[0], slot[1], players, optimalLineupBench, excludedLineupSlots, excludedPositions));
    });
    return optimalLineupBench;
}

function getHighestProjectedPlayersForSlot(slotID: number, numPlayers: number, players: Player[], takenPlayers: Player[], excludedLineupSlots: number[], excludedPositions: number[]): Player[] {
    // Filter players who have already been included or who are not eligible for the slot or who have scored less than 0 since an empty slot would be a better play
    const eligibleSortedPlayers = players.filter((player) => {
        return (player.eligibleSlots.includes(slotID) && !takenPlayers.includes(player)  && !excludedLineupSlots.includes(player.lineupSlotID) && !excludedPositions.includes(positionToInt.get(player.position)));
    }).sort((a, b) => {
        return b.projectedScore - a.projectedScore;
    });
    if (eligibleSortedPlayers.length >= numPlayers) {
        return eligibleSortedPlayers.slice(0, numPlayers);
    } else {
        while (eligibleSortedPlayers.length <= numPlayers) {
            eligibleSortedPlayers.push(new EmptySlot(slotID));
        }
        return eligibleSortedPlayers.slice(0, numPlayers);
    }
}

function getHighestProjectedPlayersForSlotBench(slotID: number, numPlayers: number, players: Player[], takenPlayers: Player[], excludedLineupSlots: number[], excludedPositionSlots: number[]): Player[] {
    // Filter players who have already been included or who are not eligible for the slot or who have scored less than 0 since an empty slot would be a better play
    let eligibleSortedPlayers = players.filter((player) => {
        return (player.eligibleSlots.includes(slotID) && !takenPlayers.includes(player) && !excludedLineupSlots.includes(player.lineupSlotID) && !excludedPositionSlots.includes(positionToInt.get(player.position)));
    }).sort((a, b) => {
        return b.projectedScore - a.projectedScore;
    });
    if (eligibleSortedPlayers.length >= numPlayers) {
        eligibleSortedPlayers = eligibleSortedPlayers.slice(0, numPlayers);
    } else {
        while (eligibleSortedPlayers.length <= numPlayers) {
            eligibleSortedPlayers.push(new EmptySlot(slotID));
        }
        eligibleSortedPlayers = eligibleSortedPlayers.slice(0, numPlayers);
    }
    return players.filter((player) => {
        return !eligibleSortedPlayers.includes(player);
    });
}
