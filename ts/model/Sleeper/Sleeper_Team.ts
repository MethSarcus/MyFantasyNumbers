class Sleeper_Team implements Team {
    public lineup: Sleeper_Player[];
    public bench: Sleeper_Player[];
    public IR: Sleeper_Player[];
    public matchupID: number;
    public teamID: number;
    public score: number;
    public potentialPoints: number;
    public projectedScore: number;
    public opponentID: number;
    public gutDifference: number;
    public gutPlayers: number;
    constructor(lineup: string[], totalRoster: string[], score: number, matchupID: number, rosterID: number, opponentID: number, weekNumber, activeLineupSlots, lineupOrder: string[]) {
        this.lineup = lineup.map((playerID, index) => {
            return new Sleeper_Player(playerID, weekNumber, positionToInt.get(lineupOrder[index]));
        });
        this.bench = totalRoster.filter( element => {
            return !lineup.includes(element);
        }).map(playerID => {
            return new Sleeper_Player(playerID, weekNumber, positionToInt.get("BN"));
        });
        this.IR = [];
        this.opponentID = opponentID;
        this.teamID = rosterID;
        this.score = score;
        this.matchupID = matchupID;
    }

    public getOptimalLineup(activeLineupSlots: number[]): Sleeper_Player[] {
        const rosterSlots = [];
        // tslint:disable-next-line: forin
        for (const i in activeLineupSlots) {
            for (let w = 0; w < activeLineupSlots[i][1]; w++) {
                rosterSlots.push(activeLineupSlots[i][0]);
            }
        }
        var optimalLineup = new Array<Sleeper_Player>();
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

    public getTeamScore(players: Sleeper_Player[]): number {
        let score = 0;
        for (const i in players) {
            if (players[i].score != null && players[i].score !== "undefined") {
                score += players[i].score;
            }
        }
        return score;
    }

    public getProjectedScore(players: Sleeper_Player[]): number {
        var projectedScore = 0;
        for (const i in players) {
            if (players[i].projectedScore != null && players[i].projectedScore !== "undefined") {
                projectedScore += players[i].projectedScore;
            }
        }
        return projectedScore;
    }

    public getMVP(): Sleeper_Player {
        var mvp = this.lineup[0];
        var mvpScore = 0;
        this.lineup.forEach(player => {
            if (player.score > mvpScore) {
                mvpScore = player.score;
                mvp = player;
            }
        });
        return mvp;
    }

    public getLVP(): Sleeper_Player {
        var lvp = this.lineup[0];
        var lvpScore = this.lineup[0].score;
        this.lineup.forEach(player => {
            if (player.score > lvpScore) {
                lvpScore = player.score;
                lvp = player;
            }
        });
        return lvp;
    }

    public getPositionalPlayers(position: string): Sleeper_Player[] {
        const players = this.lineup;
        var positionPlayers = [];
        players.forEach((player) => {
            if (player.position == position) {
                positionPlayers.push(player);
            }
        });
        return positionPlayers;
    }

    public getEligibleSlotPlayers(slot: number): Sleeper_Player[] {
        var players = this.lineup.concat(this.bench, this.IR);
        var eligiblePlayers = players.filter(function (it) {
            return it.isEligible(slot) == true;
        });

        return eligiblePlayers;
    }

    public getEligibleSlotBenchPlayers(slot: number): Sleeper_Player[] {
        var players = this.bench.concat(this.IR);
        var eligiblePlayers = players.filter(function (it) {
            return it.isEligible(slot) == true;
        });

        return eligiblePlayers;
    }

    public getProjectedOptimalLineup(activeLineupSlots: number[]): Sleeper_Player[] {
        const rosterSlots = [];
        // tslint:disable-next-line: forin
        for (const i in activeLineupSlots) {
            for (let w = 0; w < activeLineupSlots[i][1]; w++) {
                rosterSlots.push(activeLineupSlots[i][0]);
            }
        }
        var optimalLineup = new Array<Sleeper_Player>();
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
                if (eligibleWeekPlayers[z].projectedScore > highScore) {
                    highScore = eligibleWeekPlayers[z].projectedScore;
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

    public getGutPoints(activeLineupSlots: number[]): [number, number] {
        var players = this.getProjectedLinupPlayerDifference(activeLineupSlots);
        var gutPlayers = players[0];
        var satPlayers = players[1];

        var diff = this.getTeamScore(gutPlayers) - this.getTeamScore(satPlayers);
        var playerNum = gutPlayers.length;
        return [diff, playerNum];
    }

    public getProjectedLinupPlayerDifference(activeLineupSlots: number[]): [Sleeper_Player[], Sleeper_Player[]] {
        var gutPlayers = [];
        var satPlayers = [];
        var projectedLineup = this.getProjectedOptimalLineup(activeLineupSlots);
        this.lineup.forEach(player => {
            if (!includesPlayer(player, projectedLineup)) {
                gutPlayers.push(player);
            }
        });
        projectedLineup.forEach(player => {
            if (!includesPlayer(player, this.lineup)) {
                satPlayers.push(player);
            }
        });

        return [gutPlayers, satPlayers];
    }

    public setTeamMetrics(activeLineupSlots): void {
        
        this.potentialPoints = this.getTeamScore(this.getOptimalLineup(activeLineupSlots));
        this.projectedScore = this.getProjectedScore(this.lineup);
        var gutArray = this.getGutPoints(activeLineupSlots);
        this.gutDifference = gutArray[0];
        this.gutPlayers = gutArray[1];
    }
}
