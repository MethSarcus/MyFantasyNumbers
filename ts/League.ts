import {std} from "mathjs";
export class League {
    public id: number;
    public weeks: Week[];
    public season: number;
    public members: Member[];
    public settings: Settings;
    public seasonPortion: SEASON_PORTION;
    constructor(id, season, weeks, members, settings) {
        this.id = id;
        this.weeks = weeks;
        this.season = season;
        this.members = members;
        this.settings = settings;
        this.seasonPortion = SEASON_PORTION.REGULAR;
    }

    public setMemberStats(weeks): void {
        weeks.forEach( (week) => {
            const weekMatches = [];
            week.matchups.forEach((matchup) => {
                if (matchup.byeWeek !== true) {
                    if (matchup.isTie !== true) {
                        this.getMember(matchup.winner).stats.wins += 1;
                        this.getMember(matchup.getOpponent(matchup.winner).teamID).stats.losses += 1;
                    } else {
                        this.getMember(matchup.home.teamID).stats.ties += 1;
                        this.getMember(matchup.away.teamID).stats.ties += 1;
                    }
                    this.getMember(matchup.home.teamID).stats.pa += matchup.away.score;
                    this.getMember(matchup.away.teamID).stats.pa += matchup.home.score;
                    weekMatches.push(matchup.home);
                    weekMatches.push(matchup.away);
                } else {
                    weekMatches.push(matchup.home);
                }
            });
            weekMatches.sort((x: Team, y: Team) => {
                if (x.score < y.score) {
                  return -1;
                }
                if (x.score > y.score) {
                  return 1;
                }
                return 0;
              });

            for (let i = 0; i < weekMatches.length; i++) {
                const curMember: Member = this.getMember(weekMatches[i].teamID);
                const curMemberTeam: Team = weekMatches[i];
                curMember.stats.pf += curMemberTeam.score;
                curMember.stats.pp += curMemberTeam.potentialPoints;
                curMember.stats.powerWins += i;
                curMember.stats.powerLosses += (weekMatches.length - 1 - i);
            }
       });

        this.members.forEach((member) => {
           member.setAdvancedStats(weeks);
       });
    }

    public resetStats(): void {
        this.members.forEach((member) => {
            member.stats = new Stats(member.stats.finalStanding);
        });
    }

    public getSeasonPortionWeeks(): Week[] {
        let weekPortion = this.weeks;
        if (this.seasonPortion === SEASON_PORTION.REGULAR) {
            weekPortion = this.weeks.filter((it) => {
                return it.isPlayoffs === false;
            });
        } else if (this.seasonPortion === SEASON_PORTION.POST) {
            weekPortion = this.weeks.filter((it) => {
                return it.isPlayoffs === true;
            });
        }
        return weekPortion;
    }

    public getMember(teamID: number): Member {
        let found;
        this.members.forEach((member) => {
            if (teamID === member.teamID) {
                found = member;
            }
        });
        return found;
    }

    public getMemberBestWeek(teamID): Team {
        let highScore = 0;
        let highTeam;
        this.weeks.forEach((week) => {
            if (week.getTeam(teamID).score > highScore) {
                highScore = week.getTeam(teamID).score;
                highTeam = week.getTeam(teamID);
            }
        });
        return highTeam;
    }

    public getLeagueWeeklyAverage(): number {
        let totalPoints = 0;
        this.weeks.forEach((week) => {
            totalPoints += week.getWeekAverage();
        });

        return totalPoints / this.weeks.length;
    }

    public getStandardDeviation(weeks) {
        const scores = [];
        weeks.forEach((week) => {
            week.matchups.forEach((matchup) => {
                if (matchup.byeWeek !== true) {
                    scores.push(matchup.home.score);
                    scores.push(matchup.away.score);
                } else {
                    scores.push(matchup.home.score);
                }
            });
        });

        let dev = std(scores);
        dev = roundToHundred(dev);
        return dev;
    }

    public getPointsAgainstFinish(teamID: number): number {
        let finish = 1;
        const pa = this.getMember(teamID).stats.pa;
        this.members.forEach((member) => {
            if (pa > member.stats.pa && member.teamID !== teamID) {
                finish += 1;
            }
        });

        return finish;
    }

    public getPointsScoredFinish(teamID: number): number {
        let finish = 1;
        const pf = this.getMember(teamID).stats.pf;
        this.members.forEach((member) => {
            if (pf < member.stats.pf && member.teamID !== teamID) {
                finish += 1;
            }
        });

        return finish;
    }

    public getPotentialPointsFinish(teamID: number): number {
        let finish = 1;
        const pp = this.getMember(teamID).stats.pp;
        this.members.forEach((member) => {
            if (pp < member.stats.pp && member.teamID !== teamID) {
                finish += 1;
            }
        });

        return finish;
    }

    public getBestWeek(teamID: number): Matchup {
        let bestWeekMatchup = this.weeks[0].getTeamMatchup(teamID);
        let highestScore = this.weeks[0].getTeam(teamID).score;
        this.weeks.forEach((week) => {
            if (week.getTeam(teamID).score > highestScore) {
                highestScore = week.getTeam(teamID).score;
                bestWeekMatchup = week.getTeamMatchup(teamID);
            }
        });

        return bestWeekMatchup;
    }

    public getLargestMarginOfVictory(): Matchup {
        let highestMOV = 0;
        let highestMOVMatchup;
        this.weeks.forEach((week) => {
            week.matchups.forEach((matchup) => {
                if (matchup.marginOfVictory > highestMOV && !matchup.byeWeek) {
                    highestMOV = matchup.marginOfVictory;
                    highestMOVMatchup = matchup;
                }
            });

        });
        return highestMOVMatchup;
    }

    public getSmallestMarginOfVictory(): Matchup {
        let smallestMOV = this.weeks[0].matchups[0].marginOfVictory;
        let smallestMOVMatchup;
        this.weeks.forEach((week) => {
            week.matchups.forEach((matchup) => {
                if (matchup.marginOfVictory < smallestMOV && !matchup.byeWeek) {
                    smallestMOV = matchup.marginOfVictory;
                    smallestMOVMatchup = matchup;
                }
            });

        });
        return smallestMOVMatchup;
    }
}
