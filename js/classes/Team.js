class Team {
    constructor(teamID, players, activeLineupSlots, opponentID) {
        this.lineup = [];
        this.bench = [];
        this.IR = [];
        this.opponentID = opponentID;
        players.forEach((player) => {
            if (player.lineupSlotID === 21) {
                this.IR.push(player);
            }
            else if (player.lineupSlotID === 20) {
                this.bench.push(player);
            }
            else {
                this.lineup.push(player);
            }
        });
        this.teamID = teamID;
        this.score = this.getTeamScore(this.lineup);
        this.potentialPoints = this.getTeamScore(this.getOptimalLineup(activeLineupSlots));
        this.projectedScore = this.getProjectedScore(this.lineup);
    }
    getOptimalLineup(activeLineupSlots) {
        const rosterSlots = [];
        // tslint:disable-next-line: forin
        for (const i in activeLineupSlots) {
            for (let w = 0; w < activeLineupSlots[i][1]; w++) {
                rosterSlots.push(activeLineupSlots[i][0]);
            }
        }
        const optimalLineup = new Array();
        // tslint:disable-next-line: forin
        for (const x in rosterSlots) {
            let highScore = 0;
            let bestPlayer = null;
            const eligibleWeekPlayers = [];
            const players = this.lineup.concat(this.bench, this.IR);
            for (const y in players) {
                if (players[y].isEligible(parseInt(rosterSlots[x], 10)) && !includesPlayer(players[y], optimalLineup)) {
                    eligibleWeekPlayers.push(players[y]);
                }
            }
            for (const z in eligibleWeekPlayers) {
                if (eligibleWeekPlayers[z].score > highScore) {
                    highScore = eligibleWeekPlayers[z].score;
                    bestPlayer = eligibleWeekPlayers[z];
                }
            }
            if (bestPlayer != null) {
                optimalLineup.push(bestPlayer);
                highScore = 0;
            }
        }
        return optimalLineup;
    }
    getTeamScore(players) {
        let score = 0;
        for (const i in players) {
            if (players[i].score != null && players[i].score !== "undefined") {
                score += players[i].score;
            }
        }
        return score;
    }
    getProjectedScore(players) {
        const projectedScore = 0;
        for (const i in players) {
            if (players[i].projectedScore != null && players[i].projectedScore !== "undefined") {
                this.projectedScore += players[i].projectedScore;
            }
        }
        return projectedScore;
    }
}
//# sourceMappingURL=Team.js.map