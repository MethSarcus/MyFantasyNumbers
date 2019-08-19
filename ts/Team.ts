class Team {
    public lineup: Player[];
    public bench: Player[];
    public IR: Player[];
    public teamID: number;
    public score: number;
    public potentialPoints: number;
    public projectedScore: number;
    public opponentID: number;
    constructor(teamID, players, activeLineupSlots, opponentID) {
        this.lineup = [];
        this.bench = [];
        this.IR = [];
        this.opponentID = opponentID;
        players.forEach((player) => {
            if (player.lineupSlotID === 21) {
                this.IR.push(player);
            } else if (player.lineupSlotID === 20) {
                this.bench.push(player);
            } else {
                this.lineup.push(player);
            }
        });
        this.teamID = teamID;
        this.score = this.getTeamScore(this.lineup);
        this.potentialPoints = this.getTeamScore(this.getOptimalLineup(activeLineupSlots));
        this.projectedScore = this.getProjectedScore(this.lineup);
    }

    public getOptimalLineup(activeLineupSlots: number[]): Player[] {
        const rosterSlots = [];
        // tslint:disable-next-line: forin
        for (const i in activeLineupSlots) {
            for (let w = 0; w < activeLineupSlots[i][1]; w++) {
                rosterSlots.push(activeLineupSlots[i][0]);
            }
        }
        var optimalLineup = new Array<Player>();
        // tslint:disable-next-line: forin
        for (const x in rosterSlots) {
            let highScore = 0;
            let bestPlayer = null;
            var eligibleWeekPlayers = [];
            const players = this.lineup.concat(this.bench, this.IR);
            for (const y in players) {
                if (!includesPlayer(players[y], optimalLineup)) {
                    if (players[y].isEligible(rosterSlots[x])) {
                        eligibleWeekPlayers.push(players[y]);
                    }
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

    public getTeamScore(players: Player[]): number {
        let score = 0;
        for (const i in players) {
            if (players[i].score != null && players[i].score !== "undefined") {
                score += players[i].score;
            }
        }
        return score;
    }

    public getProjectedScore(players: Player[]): number {
        const projectedScore = 0;
        for (const i in players) {
            if (players[i].projectedScore != null && players[i].projectedScore !== "undefined") {
                this.projectedScore += players[i].projectedScore;
            }
        }
        return projectedScore;
    }
}
