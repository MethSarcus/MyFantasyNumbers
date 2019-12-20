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
    constructor(home: Team, away: Team, weekNumber: number, isPlayoff: boolean) {
        this.home = home;
        this.away = away;
        this.weekNumber = weekNumber;
        this.isPlayoffs = isPlayoff;
        this.setMatchupStats();
    }

    public setMatchupStats() {
        this.isTie = false;
        if (this.away === undefined || this.away === null) {
            this.byeWeek = true;
            this.isUpset = false;
            this.isTie = false;
        } else {
            if (this.home.projectedScore > this.away.projectedScore) {
                this.projectedWinner = this.home.teamID;
            } else {
                this.projectedWinner = this.away.teamID;
            }
            this.projectedMOV = (Math.abs(this.home.projectedScore - this.away.projectedScore));
            if (this.home.score > this.away.score) {
                this.winner = this.home.teamID;
            } else if (this.home.score < this.away.score) {
                this.winner = this.away.teamID;
            } else {
                this.isTie = true;
                this.isUpset = false;
            }
            this.marginOfVictory = (Math.abs(this.home.score - this.away.score));
            this.byeWeek = false;
            if (this.projectedWinner !== this.winner) {
                this.isUpset = true;
            } else {
                this.isUpset = false;
            }
        }
    }

    public getWinningTeam(): Team {
        if (this.byeWeek) {
            return null;
        } else if (this.home.score > this.away.score) {
            return this.home;
        } else {
            return this.away;
        }
    }

    public getHighestScoringTeam(): Team {
        if (this.byeWeek) {
            return this.home;
        } else if (this.home.score > this.away.score) {
            return this.home;
        } else {
            return this.away;
        }
    }

    public getLowestScoringTeam(): Team {
        if (this.byeWeek) {
            return this.home;
        } else if (this.home.score > this.away.score) {
            return this.away;
        } else {
            return this.home;
        }
    }

    public getLosingTeam(): Team {
        if (this.byeWeek) {
            return null;
        } else if (this.home.score < this.away.score) {
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

    public gutHadImpact(teamID: number): boolean {
        const team = this.getTeam(teamID);
        if (this.marginOfVictory > Math.abs(team.gutDifference)) {
            return false;
        } else {
            return true;
        }
    }

    public setPoorLineupDecisions(): void {
        let whiffedChoices = 0;
        let team = this.home;
        if (!this.byeWeek) {
            if (this.home.score > this.away.score) {
                team = this.away;
            }
            team.lineup.forEach((startingPlayer) => {
                team.getEligibleSlotBenchPlayers(startingPlayer.lineupSlotID).forEach((benchedPlayer) => {
                    const diff = benchedPlayer.score - startingPlayer.score;
                    if (diff > this.marginOfVictory) {
                        whiffedChoices += 1;
                    }
                });
            });
            this.loserPotentialWinningSingleMoves = whiffedChoices;
            if (this.loserPotentialWinningSingleMoves > 0) {
                this.withinSingleMoveOfWinning = true;
            } else {
                this.withinSingleMoveOfWinning = false;
            }
        }
    }
}
