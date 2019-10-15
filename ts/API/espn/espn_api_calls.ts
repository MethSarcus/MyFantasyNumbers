function getESPNMatchups(settings: Settings, members: Member[], leagueID: number, seasonID: string, leagueName: string) {
    const weeks = [];
    let weeksToGet;
    if (settings.currentMatchupPeriod < settings.regularSeasonLength + settings.playoffLength) {
        weeksToGet = settings.currentMatchupPeriod - 1;
    } else {
        weeksToGet = settings.regularSeasonLength + settings.playoffLength;
    }
    for (let q = 1; q <= weeksToGet; q++) {
        espn_request("get", {
            path: "apis/v3/games/ffl/seasons/" + seasonID + "/segments/0/leagues/" + leagueID + "?view=mScoreboard&teamId=1&scoringPeriodId=" + q
        }).done((json) => {
            const matchups = [];
            for (const i in Object.keys(json.schedule)) { // increments through each matchup
                const curWeek = json.schedule[i];
                if (curWeek.home.rosterForCurrentScoringPeriod != null || curWeek.home.rosterForCurrentScoringPeriod !== undefined) { // checks if the roster data is available for scraping
                    const homeTeamID = curWeek.home.teamId;
                    const homePlayers = [];
                    for (const z in curWeek.home.rosterForCurrentScoringPeriod.entries) {
                        // (firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID
                        const curPlayer = curWeek.home.rosterForCurrentScoringPeriod.entries[z];
                        const firstName = curPlayer.playerPoolEntry.player.firstName;
                        const lastName = curPlayer.playerPoolEntry.player.lastName;
                        const score = roundToHundred(curPlayer.playerPoolEntry.appliedStatTotal);
                        // console.log(curPlayer);
                        let projectedScore = 0;
                        if (curPlayer.playerPoolEntry.player.stats.length === 0) {
                            projectedScore = 0;
                        } else if (curPlayer.playerPoolEntry.player.stats[1] === undefined) {
                            projectedScore = 0;
                        } else if (curPlayer.playerPoolEntry.player.stats[1].statSourceId === 1) {
                            projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[1].appliedTotal);
                        } else {
                            projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[0].appliedTotal);
                        }

                        const eligibleSlots = curPlayer.playerPoolEntry.player.eligibleSlots;
                        const position = getPosition(curPlayer.playerPoolEntry.player.eligibleSlots);
                        const realTeamID = curPlayer.playerPoolEntry.player.proTeamId;
                        const playerID = curPlayer.playerId;
                        const lineupSlotID = curPlayer.lineupSlotId;
                        homePlayers.push(new ESPNPlayer(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, q));
                    }

                    let awayTeam;
                    if (curWeek.away !== null && curWeek.away !== undefined) {
                        const awayTeamID = curWeek.away.teamId;
                        const awayPlayers = [];
                        for (const l in curWeek.away.rosterForCurrentScoringPeriod.entries) {
                            const curPlayer = curWeek.away.rosterForCurrentScoringPeriod.entries[l];
                            const firstName = curPlayer.playerPoolEntry.player.firstName;
                            const lastName = curPlayer.playerPoolEntry.player.lastName;
                            const score = roundToHundred(curPlayer.playerPoolEntry.appliedStatTotal);
                            let projectedScore = 0;
                            if (curPlayer.playerPoolEntry.player.stats.length === 0) {
                                projectedScore = 0;
                            } else if (curPlayer.playerPoolEntry.player.stats[1] === undefined) {
                                projectedScore = 0;
                            } else if (curPlayer.playerPoolEntry.player.stats[1].statSourceId === 1) {
                                projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[1].appliedTotal);
                            } else {
                                projectedScore = roundToHundred(curPlayer.playerPoolEntry.player.stats[0].appliedTotal);
                            }
                            const eligibleSlots = curPlayer.playerPoolEntry.player.eligibleSlots;
                            const position = getPosition(curPlayer.playerPoolEntry.player.eligibleSlots);
                            const realTeamID = curPlayer.playerPoolEntry.player.proTeamId;
                            const playerID = curPlayer.playerId;
                            const lineupSlotID = curPlayer.lineupSlotId;
                            awayPlayers.push(new ESPNPlayer(firstName, lastName, score, projectedScore, position, realTeamID, playerID, lineupSlotID, eligibleSlots, q));
                        }
                        awayTeam = new ESPNTeam(awayTeamID, awayPlayers, settings.activeLineupSlots, homeTeamID);
                    }
                    const isPlayoff = (q > settings.regularSeasonLength);
                    const homeTeam = new ESPNTeam(homeTeamID, homePlayers, settings.activeLineupSlots, awayTeam);
                    matchups.push(new Matchup(homeTeam, awayTeam, q, isPlayoff));
                }
            }
            const isPlayoffs = (q > settings.regularSeasonLength);
            weeks.push(new Week(q, isPlayoffs, matchups));
            if (weeks.length === weeksToGet) {
                weeks.sort((x, y) => {
                    if (x.weekNumber < y.weekNumber) {
                        return -1;
                    }
                    if (x.weekNumber > y.weekNumber) {
                        return 1;
                    }
                    return 0;
                });
                const league = new League(leagueID, seasonID, weeks, members, settings, leagueName, PLATFORM.ESPN);
                league.setMemberStats(league.getSeasonPortionWeeks());
                localStorage.setItem(leagueID + seasonID, JSON.stringify(league));
                setPage(league);
            }
        });
    }
}

function getESPNSettings(leagueID, seasonID) {
    espn_request("get", {
        path: "apis/v3/games/ffl/seasons/" + seasonID + "/segments/0/leagues/" + leagueID + "?view=mSettings"
    }).done((json) => {
        if (json.hasOwnProperty("messages") && json.messages[0] === "You are not authorized to view this League.") {
            alert("Error: League not accessable, make sure your league is set to public for the season you are trying to view");
        }
        if (json.hasOwnProperty("details") && json.details[0].message === "You are not authorized to view this League.") {
            alert("Error: League not accessable, make sure your league is set to public for the season you are trying to view");
        }
        const regularSeasonMatchupCount = json.settings.scheduleSettings.matchupPeriodCount;
        const divisions = json.settings.scheduleSettings.divisions;
        const draftOrder = json.settings.draftSettings.pickOrder;
        const scoringType = json.settings.scoringSettings.playerRankType;
        const totalMatchupCount = json.status.finalScoringPeriod;
        const currentMatchupPeriod = json.status.currentMatchupPeriod;
        const leagueSeasons = json.status.previousSeasons;
        const isActive = json.status.isActive;
        const playoffLength = totalMatchupCount - regularSeasonMatchupCount;
        const DRAFT_TYPE = json.settings.draftSettings.type;
        const lineupSlots = Object.entries(json.settings.rosterSettings.lineupSlotCounts);
        const lineup = lineupSlots.map((slot) => {
            return [parseInt(slot[0], 10), slot[1]];
        }).filter((slot) => {
            return slot[1] !== 0;
        });
        leagueSeasons.push(seasonID);
        const leagueName = json.settings.name;
        const activeLineupSlots = lineup.filter((slot) => {
            return slot[0] !== 21 && slot[0] !== 20;
        });
        const settings = new Settings(activeLineupSlots, lineup, regularSeasonMatchupCount, playoffLength, DRAFT_TYPE, currentMatchupPeriod, isActive, leagueSeasons);
        getESPNMembers(settings, leagueID, seasonID, leagueName);
    });
}

function getESPNMembers(settings, leagueID, seasonID, leagueName) {
    espn_request("get", {
        path: "apis/v3/games/ffl/seasons/" + seasonID + "/segments/0/leagues/" + leagueID + "?view=mTeam"
    }).done((json) => {
        const members = [];
        const teams = json.teams;
        const seasonLength = settings.regularSeasonMatchupCount + settings.playoffLength;
        for (const i in Object.keys(json.members)) {
            const member = json.members[i];
            const firstName = member.firstName;
            const lastName = member.lastName;
            const memberID = member.id.toString();
            const notificationSettings = member.notificationSettings;

            for (const x in Object.keys(teams)) {
                if (teams[x].primaryOwner === memberID) {
                    const curTeam = teams[x];
                    const location = curTeam.location;
                    const nickname = curTeam.nickname;
                    const teamAbbrev = curTeam.abbrev;
                    const curProjectedRank = curTeam.currentProjectedRank;
                    const draftDayProjectedRank = curTeam.draftDayProjectedRank;
                    const divisionID = curTeam.divisionId;
                    const transactions = curTeam.transactionCounter;
                    const teamID = parseInt(curTeam.id, 10);
                    const logo = curTeam.logo;
                    const finalStanding = curTeam.rankCalculatedFinal;
                    members.push(new ESPNMember(memberID, firstName, lastName, location, nickname, teamAbbrev, divisionID, teamID, logo, transactions, new Stats(finalStanding)));
                }
            }
        }
        getESPNMatchups(settings, members, leagueID, seasonID, leagueName);
    });
}
