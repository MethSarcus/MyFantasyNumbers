class Matchup {
    public home: Team;
    public weekNumber: number;
    public isPlayoffs: boolean;
    public isTie: boolean;
    public byeWeek: boolean;
    public isUpset: boolean;
    public away: any;
    public projectedWinner: number;
    public projectedMOV: number;
    public winner: number;
    public marginOfVictory: number;
    public loserPotentialWinningSingleMoves: number;
    public withinSingleMoveOfWinning: boolean;
    constructor(home, away, weekNumber, isPlayoff) {
        this.home = home;
        this.weekNumber = weekNumber;
        this.isPlayoffs = isPlayoff;
        if (away == undefined || away == null) {
            this.byeWeek = true;
            this.isUpset = false;
            this.isTie = false;
        } else {
            this.away = away;
            if (home.projectedScore > away.projectedScore) {
                this.projectedWinner = home.teamID;
            } else {
                this.projectedWinner = away.teamID;
            }
            this.projectedMOV = (Math.abs(home.projectedScore - away.projectedScore));
            if (home.score > away.score) {
                this.winner = home.teamID;
            } else if (home.score < away.score) {
                this.winner = away.teamID;
            } else {
                this.isTie = true;
                this.isUpset = false;
            }
            this.marginOfVictory = (Math.abs(home.score - away.score));
            this.byeWeek = false;
            if (this.projectedWinner !== this.winner) {
                this.isUpset = true;
            } else {
                this.isUpset = false;
            }

            this.loserPotentialWinningSingleMoves = this.getPoorLineupDecisions();
            if (this.loserPotentialWinningSingleMoves > 0) {
                this.withinSingleMoveOfWinning = true;
            } else {
                this.withinSingleMoveOfWinning = false;
            }
        }
    }

    public getWinningTeam(): any {
        if (this.byeWeek) {
            return null;
        } else if (this.home.score > this.away.score) {
            return this.home;
        } else {
            return this.away;
        }
    }

    public hasTeam(teamID: number): boolean {
        if (this.byeWeek !== true) {
            if (this.home.teamID === teamID || this.away.teamID === teamID) {
                return true;
                } 
            } else {
                if (this.home.teamID === teamID) {
                    return true;
            }
        }
    }

    public getTeam(teamID: number): Team {
        if (this.home.teamID === teamID) {
            return this.home;
        } else if (this.away.teamID === teamID) {
            return this.away;
        }
    }

    public getOpponent(teamID: number): Team {
        if (this.home.teamID === teamID && this.byeWeek === false) {
            return this.away;
        } else if (this.away.teamID === teamID) {
            return this.home;
        } else {
            return null;
        }
    }

    public getPoorLineupDecisions(): number {
        var whiffedChoices = 0;
        var team = this.home;
        if (this.home.score > this.away.score) {
            team = this.away;
        }
        team.lineup.forEach(startingPlayer => {
            team.getEligibleSlotBenchPlayers(startingPlayer.lineupSlotID).forEach(benchedPlayer => {
                let diff = benchedPlayer.score - startingPlayer.score
                if (diff > this.marginOfVictory) {
                    whiffedChoices += 1;
                }
            });
        });

        return whiffedChoices;
    }
}
