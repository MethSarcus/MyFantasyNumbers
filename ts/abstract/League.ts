abstract class League {
    public id: string;
    public leagueName: string;
    public weeks: Week[];
    public season: number;
    public members: Member[];
    public settings: Settings;
    public seasonPortion: SEASON_PORTION;
    public weeklyPowerRanks: Map<number, WeeklyPowerRanks>;
    public leaguePlatform: PLATFORM;
    constructor(weeks: Week[], members: Member[], settings: Settings, leaguePlatform: PLATFORM) {
        this.id = settings.leagueInfo.leagueId;
        this.weeks = weeks;
        this.season = settings.leagueInfo.seasonId;
        this.members = members;
        this.settings = settings;
        this.seasonPortion = SEASON_PORTION.ALL;
        this.leagueName = settings.leagueInfo.leagueName;
        this.leaguePlatform = leaguePlatform;
    }

    // public abstract convertFromJson(object: any): League;

    public setPowerRanks(): void {
        this.weeklyPowerRanks = new Map();
        this.getSeasonPortionWeeks().forEach((week) => {
            this.addPowerWeek(week);
        });
    }

    public addPowerWeek(week: Week): void {
        const weeklyPowerRanks = new WeeklyPowerRanks(week.weekNumber, week.isPlayoffs);
        week.matchups.forEach((matchup) => {
            weeklyPowerRanks.addMatchup(matchup);
        });
        weeklyPowerRanks.setRanks();
        this.weeklyPowerRanks.set(week.weekNumber, weeklyPowerRanks);
    }

    public setMemberStats(weeks: Week[]): void {
        weeks.forEach((week: Week) => {
            const weekMatches: Team[] = [];
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
                curMember.stats.gutPlayersPlayed += curMemberTeam.gutPlayers;
                curMember.stats.gutPoints += curMemberTeam.gutDifference;
                curMember.stats.pf += curMemberTeam.score;
                curMember.stats.pp += curMemberTeam.potentialPoints;
                curMember.stats.OPSLAP += curMemberTeam.projectedBestLineupPoints;
                curMember.stats.powerWins += i;
                curMember.stats.powerLosses += (weekMatches.length - 1 - i);
            }

            weekMatches.sort((x: Team, y: Team) => {
                if (x.potentialPoints < y.potentialPoints) {
                    return -1;
                }
                if (x.potentialPoints > y.potentialPoints) {
                    return 1;
                }
                return 0;
            });
            for (let i = 0; i < weekMatches.length; i++) {
                const curMember: Member = this.getMember(weekMatches[i].teamID);
                curMember.stats.potentialPowerWins += i;
                curMember.stats.potentialPowerLosses += (weekMatches.length - 1 - i);
            }
        });
        this.members.forEach((member) => {
            member.setAdvancedStats(weeks);
            member.stats.rank = this.getRank(member.teamID);
            member.stats.roundStats();
            member.stats.choicesThatCouldHaveWonMatchup = this.getLosingDecisionAmount(member.teamID);
            member.stats.gameLostDueToSingleChoice = this.getGamesLostDueToSingleChoice(member.teamID);
            member.stats.powerRank = this.getPowerRankFinish(member.teamID);
            this.setAverageMargins(member.teamID);
        });
    }

    public resetStats(): void {
        this.members.forEach((member) => {
            member.stats = new Stats(member.stats.finalStanding);
        });
    }

    public getLeaguePF(): number {
        let pf = 0;
        this.members.forEach((member) => {
            pf += member.stats.pf;
        });

        return roundToHundred(pf / this.members.length);
    }

    public getLeaguePA(): number {
        let pa = 0;
        this.members.forEach((member) => {
            pa += member.stats.pa;
        });

        return roundToHundred(pa / this.members.length);
    }

    public getLeaguePP(): number {
        let pp = 0;
        this.members.forEach((member) => {
            pp += member.stats.pp;
        });

        return roundToHundred(pp / this.members.length);
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
        } else if (this.seasonPortion === SEASON_PORTION.PRE) {
            this.seasonPortion = SEASON_PORTION.PRE;
            weekPortion = this.weeks.filter((it) => {
                return it.isPlayoffs === false;
            });
        } else if (weekPortion === []) {
            this.seasonPortion = SEASON_PORTION.POST;
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

    public getMemberWorstTeam(teamID: number): Team {
        let lowestScore = this.getSeasonPortionWeeks()[0].getTeam(teamID).score;
        let worstTeam = this.getSeasonPortionWeeks()[0].getTeam(teamID);
        this.getSeasonPortionWeeks().forEach((week) => {
            if (week.getTeam(teamID).score < lowestScore) {
                lowestScore = week.getTeam(teamID).score;
                worstTeam = week.getTeam(teamID);
            }
        });

        return worstTeam;
    }

    public getBiggestBoom(teamID: number): Player {
        let boomPlayer = this.getSeasonPortionWeeks()[0].getTeam(teamID).lineup[0];
        this.getSeasonPortionWeeks().forEach((week) => {
            week.getTeam(teamID).lineup.forEach((player) => {
                if (player.score > boomPlayer.score) {
                    boomPlayer = player;
                }
            });
        });
        return boomPlayer;
    }

    public getMemberBestTeam(teamID: number): Team {
        let highestScore = this.getSeasonPortionWeeks()[0].getTeam(teamID).score;
        let bestTeam = this.getSeasonPortionWeeks()[0].getTeam(teamID);
        this.getSeasonPortionWeeks().forEach((week) => {
            if (week.getTeam(teamID).score > highestScore) {
                highestScore = week.getTeam(teamID).score;
                bestTeam = week.getTeam(teamID);
            }
        });

        return bestTeam;
    }

    public getBestWeekFinish(teamID: number): number {
        let finish = 1;
        const bestWeekScore = this.getMemberBestTeam(teamID).score;
        this.members.forEach((member) => {
            if (bestWeekScore < this.getMemberBestTeam(member.teamID).score && member.teamID !== teamID) {
                finish += 1;
            }
        });

        return finish;
    }

    public getWeek(weekNum: number): Week {
        let myWeek;
        this.weeks.forEach((week) => {
            if (weekNum === week.weekNumber) {
                myWeek = week;
            }
        });

        return myWeek;
    }

    public getWorstWeekFinish(teamID: number): number {
        let finish = 1;
        const worstWeekScore = this.getMemberWorstTeam(teamID).score;
        this.members.forEach((member) => {
            if (worstWeekScore > this.getMemberWorstTeam(member.teamID).score && member.teamID !== teamID) {
                finish += 1;
            }
        });

        return finish;
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
    public getOPSLAPFinish(teamID: number): number {
        let finish = 1;
        const opslap = this.getMember(teamID).stats.OPSLAP;
        this.members.forEach((member) => {
            if (opslap < member.stats.OPSLAP && member.teamID !== teamID) {
                finish += 1;
            }
        });

        return finish;
    }

    public getBestWeek(teamID: number): Matchup {
        let bestWeekMatchup = this.getSeasonPortionWeeks()[0].getTeamMatchup(teamID);
        let highestScore = this.getSeasonPortionWeeks()[0].getTeam(teamID).score;
        this.getSeasonPortionWeeks().forEach((week) => {
            if (week.getTeam(teamID).score > highestScore) {
                highestScore = week.getTeam(teamID).score;
                bestWeekMatchup = week.getTeamMatchup(teamID);
            }
        });

        return bestWeekMatchup;
    }

    public getWorstWeek(teamID: number): Matchup {
        let worstWeekMatchup = this.getSeasonPortionWeeks()[0].getTeamMatchup(teamID);
        let lowestScore = this.getSeasonPortionWeeks()[0].getTeam(teamID).score;
        this.getSeasonPortionWeeks().forEach((week) => {
            if (week.getTeam(teamID).score < lowestScore) {
                lowestScore = week.getTeam(teamID).score;
                worstWeekMatchup = week.getTeamMatchup(teamID);
            }
        });

        return worstWeekMatchup;
    }

    public getLargestMarginOfVictory(): Matchup {
        let highestMOV = 0;
        let highestMOVMatchup;
        this.getSeasonPortionWeeks().forEach((week) => {
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
        let smallestMOV: number = null;
        let i = 0;
        while (smallestMOV === null) {
            if (this.getSeasonPortionWeeks()[i] && this.getSeasonPortionWeeks()[i].matchups) {
                smallestMOV = this.getSeasonPortionWeeks()[i].matchups[0].home.score;
            } else if (!this.getSeasonPortionWeeks()[i].matchups[0].byeWeek) {
                smallestMOV = this.getSeasonPortionWeeks()[i].matchups[0].away.score;
            }
            i++;
        }
        let smallestMOVMatchup;
        this.getSeasonPortionWeeks().forEach((week) => {
            week.matchups.forEach((matchup) => {
                if (matchup.marginOfVictory < smallestMOV && !matchup.byeWeek) {
                    smallestMOV = matchup.marginOfVictory;
                    smallestMOVMatchup = matchup;
                }
            });

        });
        return smallestMOVMatchup;
    }

    public getLeagueWeeklyAverage(): number {
        const scores: number[] = [];
        this.getSeasonPortionWeeks().forEach((week) => {
            week.matchups.forEach((matchup) => {
                scores.push(matchup.home.score);
                if (!matchup.byeWeek) {
                    scores.push(matchup.away.score);
                }
            });
        });

        return getMean(scores);
    }

    public getLeagueStandardDeviation(): number {
        const scores: number[] = [];
        this.getSeasonPortionWeeks().forEach((week) => {
            week.matchups.forEach((matchup) => {
                scores.push(matchup.home.score);
                if (!matchup.byeWeek) {
                    scores.push(matchup.away.score);
                }
            });
        });

        return calcStandardDeviation(scores);
    }

    public getStandardDeviationFinish(teamID: number): number {
        let finish = 1;
        const std = this.getMember(teamID).stats.standardDeviation;
        this.members.forEach((member) => {
            if (std > member.stats.standardDeviation && member.teamID !== teamID) {
                finish += 1;
            }
        });

        return finish;
    }

    public getOverallBestWeek(): Matchup {
        let bestWeekMatchup;
        let highestScore = 0;
        this.getSeasonPortionWeeks().forEach((week) => {
            week.matchups.forEach((matchup) => {
                if (matchup.home.score > highestScore) {
                    bestWeekMatchup = matchup;
                    highestScore = matchup.home.score;
                } else if (!matchup.byeWeek && matchup.away) {
                    if (matchup.away.score > highestScore) {
                        bestWeekMatchup = matchup;
                        highestScore = matchup.away.score;
                    }
                }
            });
        });

        return bestWeekMatchup;
    }

    public getOverallWorstWeek(): Matchup {
        let worstWeekMatchup;
        let lowestScore: number = null;
        let i = 0;
        while (lowestScore === null) {
            if (this.getSeasonPortionWeeks()[i] && this.getSeasonPortionWeeks()[i].matchups) {
                lowestScore = this.getSeasonPortionWeeks()[i].matchups[0].home.score;
            } else if (!this.getSeasonPortionWeeks()[i].matchups[0].byeWeek) {
                lowestScore = this.getSeasonPortionWeeks()[i].matchups[0].away.score;
            }
            i++;
        }
        this.getSeasonPortionWeeks().forEach((week) => {
            week.matchups.forEach((matchup) => {
                if (matchup.home.score < lowestScore) {
                    worstWeekMatchup = matchup;
                    lowestScore = matchup.home.score;
                } else if (!matchup.byeWeek && matchup.away) {
                    if (matchup.away.score < lowestScore) {
                        worstWeekMatchup = matchup;
                        lowestScore = matchup.away.score;
                    }
                }
            });
        });

        return worstWeekMatchup;
    }

    public getTeamAveragePointsPerPosition(teamID: number): number[] {
        const allPlayers = getSeasonPlayers(this, teamID);
        const positions = this.settings.positionInfo.getPositions();
        const scoreDict = new Map();
        const timesPlayedDict = new Map();
        const scores: number[] = [];
        positions.forEach((position) => {
            scoreDict.set(position, 0);
            timesPlayedDict.set(position, 0);
        });
        allPlayers.forEach((player) => {
            scoreDict.set(player.position, player.seasonScore + scoreDict.get(player.position));
            timesPlayedDict.set(player.position, player.weeksPlayed + timesPlayedDict.get(player.position));
        });
        positions.forEach((position) => {
            scores.push(roundToHundred(scoreDict.get(position) / timesPlayedDict.get(position) / getBestPositionPlayerAverageScore(this, position)));
        });

        return scores;
    }

    public getLeaguePointsPerPosition(): number[] {
        const allPlayers = getAllSeasonPlayers(this);
        const positions = this.settings.positionInfo.getPositions();
        const scoreDict = new Map();
        const scores: number[] = [];
        positions.forEach((position) => {
            scoreDict.set(position, 0);
        });
        allPlayers.forEach((player) => {
            scoreDict.set(player.position, player.seasonScore + scoreDict.get(player.position));
        });

        positions.forEach((position) => {
            scores.push(roundToHundred(scoreDict.get(position) / this.members.length));
        });

        return scores;
    }

    public getMemberTotalPointsPerPosition(teamID: number): number[] {
        const allPlayers = getSeasonPlayers(this, teamID);
        const positions = this.settings.positionInfo.getPositions();
        const scoreDict = new Map();
        const scores: number[] = [];
        positions.forEach((position) => {
            scoreDict.set(position, 0);
        });
        allPlayers.forEach((player) => {
            scoreDict.set(player.position, player.seasonScore + scoreDict.get(player.position));
        });
        positions.forEach((position) => {
            scores.push(roundToHundred(scoreDict.get(position)));
        });

        return scores;
    }

    public getAverageEfficiency(): number {
        let totalEfficiency = 0.00;
        this.members.forEach((member) => {
            totalEfficiency += member.stats.getEfficiency();
        });
        return totalEfficiency / this.members.length;
    }

    public getEfficiencyFinish(teamID: number): number {
        let finish = 1;
        const efficiency = this.getMember(teamID).stats.getEfficiency();
        this.members.forEach((member) => {
            if (efficiency < member.stats.getEfficiency() && member.teamID !== teamID) {
                finish += 1;
            }
        });

        return finish;
    }

    public getMemberOpponentTotalPointsPerPosition(teamID: number): number[] {
        const allPlayers = getSeasonOpponentPlayers(this, teamID);
        const positions = this.settings.positionInfo.getPositions();
        const scoreDict = new Map();
        const scores: number[] = [];
        positions.forEach((position) => {
            scoreDict.set(position, 0);
        });
        allPlayers.forEach((player) => {
            scoreDict.set(player.position, player.seasonScore + scoreDict.get(player.position));
        });
        positions.forEach((position) => {
            scores.push(roundToHundred(scoreDict.get(position)));
        });

        return scores;
    }

    public getLeagueAveragePointsPerPosition(): number[] {
        const allPlayers = getAllSeasonPlayers(this);
        const positions = this.settings.positionInfo.getPositions();
        const scoreDict = new Map();
        const timesPlayedDict = new Map();
        const scores: number[] = [];
        positions.forEach((position) => {
            scoreDict.set(position, 0);
            timesPlayedDict.set(position, 0);
        });
        allPlayers.forEach((player) => {
            scoreDict.set(player.position, player.seasonScore + scoreDict.get(player.position));
            timesPlayedDict.set(player.position, player.weeksPlayed + timesPlayedDict.get(player.position));
        });
        positions.forEach((position) => {
            scores.push(roundToHundred(scoreDict.get(position) / timesPlayedDict.get(position) / getBestPositionPlayerAverageScore(this, position)));
        });

        return scores;
    }

    public getLosingDecisionAmount(teamID: number): number {
        let totalLosingDecisions = 0;
        this.getSeasonPortionWeeks().forEach((week) => {
            const matchup = week.getTeamMatchup(teamID);
            if (matchup.winner !== teamID && !matchup.byeWeek) {
                totalLosingDecisions += matchup.loserPotentialWinningSingleMoves;
            }
        });

        return totalLosingDecisions;
    }

    public getGamesLostDueToSingleChoice(teamID: number): number {
        let winnableLosses = 0;
        this.getSeasonPortionWeeks().forEach((week) => {
            const matchup = week.getTeamMatchup(teamID);
            if (matchup.winner !== teamID && !matchup.byeWeek && matchup.withinSingleMoveOfWinning) {
                winnableLosses += 1;
            }
        });

        return winnableLosses;
    }

    public getPowerRankFinish(teamID: number): number {
        let finish = 1;
        const wins = this.getMember(teamID).stats.powerWins;
        this.members.forEach((member) => {
            if (wins < member.stats.powerWins && member.teamID !== teamID) {
                finish += 1;
            }
        });

        return finish;
    }

    public getRank(teamID: number): number {
        let finish = 1;
        const winPct = this.getMember(teamID).stats.getWinPct();
        const pf = this.getMember(teamID).stats.pf;
        this.members.forEach((member) => {
            if (winPct === member.stats.getWinPct() && member.teamID !== teamID) {
                if (pf < member.stats.pf) {
                    finish += 1;
                }
            } else if (winPct < member.stats.getWinPct() && member.teamID !== teamID) {
                finish += 1;
            }
        });

        return finish;
    }

    public getGutAverageFinish(teamID: number): number {
        let finish = 1;
        const gutAvg = this.getMember(teamID).stats.gutPoints / this.getMember(teamID).stats.gutPlayersPlayed;
        this.members.forEach((member) => {
            if (gutAvg < (member.stats.gutPoints / this.getMember(teamID).stats.gutPlayersPlayed) && member.teamID !== teamID) {
                finish += 1;
            }
        });

        return finish;
    }

    public getPowerRankDiffFinish(teamID: number): number {
        let finish = 1;
        const pwrRankDiff = this.getMember(teamID).stats.powerRank - this.getMember(teamID).stats.rank;
        this.members.forEach((member) => {
            if (pwrRankDiff < (member.stats.rank - member.stats.powerRank) && member.teamID !== teamID) {
                finish += 1;
            }
        });

        return finish;
    }

    public setAverageMargins(teamID: number): void {
        const member = this.getMember(teamID);
        this.getSeasonPortionWeeks().forEach((week) => {
            const matchup = week.getTeamMatchup(teamID);
            if (!matchup.byeWeek) {
                if (matchup.getWinningTeam().teamID === teamID) {
                    member.stats.averageMOV += matchup.marginOfVictory;
                } else if (matchup.getWinningTeam().teamID !== teamID) {
                    member.stats.averageMOD += matchup.marginOfVictory;
                }
            }
        });

        if (member.stats.wins !== 0) {
            member.stats.averageMOV = roundToHundred(member.stats.averageMOV / member.stats.wins);
        }
        if (member.stats.losses !== 0) {
            member.stats.averageMOD = roundToHundred(member.stats.averageMOD / member.stats.losses);
        }
    }

    public getMarginFinish(teamID: number, weekNumber: number) {
        let finish = 1;
        const week = this.getWeek(weekNumber);
        const teamMatchup = week.getTeamMatchup(teamID);
        if (!teamMatchup.byeWeek) {
            const margin = teamMatchup.getTeam(teamID).score - teamMatchup.getOpponent(teamID).score;
            if (margin < 0) {
                finish += 1;
            }
            week.matchups.filter((it) => !it.byeWeek).forEach((matchup) => {
                if (matchup.home.teamID !== teamID && matchup.away.teamID !== teamID) {
                    const homeMargin = matchup.home.score - matchup.away.score;
                    const awayMargin = matchup.away.score - matchup.home.score;
                    if (awayMargin > margin && homeMargin > margin) {
                        finish += 2;
                    } else if (awayMargin > margin || homeMargin > margin) {
                        finish += 1;
                    }
                }
            });
        } else {
            finish = 0;
        }

        return finish;
    }

    public getUpsets(teamID: number): [number, number] {
        let upsetCount = 0;
        let underdogCount = 0;
        this.getSeasonPortionWeeks().forEach((week) => {
            const match = week.getTeamMatchup(teamID);
            if (!match.byeWeek) {
                if (match.getWinningTeam().teamID === teamID && match.isUpset) {
                    upsetCount += 1;
                    underdogCount += 1;
                } else if (match.getWinningTeam().teamID !== teamID && !match.isUpset) {
                    underdogCount += 1;
                }
            }
        });
        return [underdogCount, upsetCount];
    }

    public getLeagueGutPointAverage(): number {
        let sum = 0;
        this.members.forEach((member) => {
            sum += member.stats.getAverageGutPoints();
        });

        return roundToHundred(sum / this.members.length);
    }

    public getHighestPPMember(): Member {
        let highMember = this.members[0];
        this.members.forEach((member) => {
            if (member.stats.pp > highMember.stats.pp) {
                highMember = member;
            }
        });

        return highMember;
    }

    public getLowestPPMember(): Member {
        let lowMember = this.members[0];
        this.members.forEach((member) => {
            if (member.stats.pp < lowMember.stats.pp) {
                lowMember = member;
            }
        });

        return lowMember;
    }

    public getHighestGutPointMember(): Member {
        let highMember = this.members[0];
        this.members.forEach((member) => {
            if (member.stats.getAverageGutPoints() > highMember.stats.getAverageGutPoints()) {
                highMember = member;
            }
        });

        return highMember;
    }

    public getLowestGutPointMember(): Member {
        let lowMember = this.members[0];
        this.members.forEach((member) => {
            if (member.stats.getAverageGutPoints() < lowMember.stats.getAverageGutPoints()) {
                lowMember = member;
            }
        });

        return lowMember;
    }

    public getMemberByStats(pf: string, pa: string, pp: string, OPSLAP: string, record: string): Member {
        let mem: Member;
        this.members.forEach((member) => {
            if (roundToHundred(member.stats.pf) === parseFloat(pf) &&
                roundToHundred(member.stats.pp) === parseFloat(pp) &&
                roundToHundred(member.stats.pa) === parseFloat(pa) &&
                roundToHundred(member.stats.OPSLAP) === parseFloat(OPSLAP) &&
                member.recordToString() === record) {
                    mem = member;
            }
        });

        return mem;
    }

    public getMemberByPowerStats(teamName: string, rank: string, powerRank: string, powerRecord: string): Member {
        let mem: Member;
        this.members.forEach((member) => {
            if (member.teamNameToString() === teamName &&
                member.stats.rank === parseInt(rank) &&
                member.stats.powerRank === parseInt(powerRank) &&
                member.powerRecordToString() === powerRecord) {
                    mem = member;
            }
        });

        return mem;
    }

    public setPage(): void {
        // localStorage.setItem(league.id + "" + league.id, JSON.stringify(league));
        // const profileImage = document.getElementById("team_image");
        // profileImage.addEventListener("error", fixNoImage);
        // tslint:disable-next-line: no-console
        document.getElementById("league_name_header").innerHTML = this.leagueName;
        enableButtons();
        createTeamMenu(this);
        createLeagueStackedGraph(this);
        createMemberStrengthScatterChart(this);
        updateLeagueStatsCards(this);
        enablePlugins();
        createPowerRankTable(this);
        createLeagueWeeklyLineChart(this, true);
        createLeagueStatsTable(this);
        initMemberWeekTable(this);
    }

    public updateMainPage(): void {
        updatePowerRankTable(this);
        updateLeagueStatsTable(this);
        updateMainPageLeagueStatCards(this);
    }
}
