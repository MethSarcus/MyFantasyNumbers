function getSleeperLeagueSettings(leagueID: string, seasonID: number) {
    sleeper_request("get", {
        path: "league/" + leagueID.toString()
    }).done((json: SleeperLeagueResponse) => {
        console.log(leagueID);
        console.log(seasonID);
        console.log(json);
        if (parseInt(json.season) != seasonID) {
            if (parseInt(json.season) < seasonID) {
                alert("Cannot look at future seasons of a league from a previous leagueID");
                return;
            } else if (json.previous_league_id != "0") {
                getSleeperLeagueSettings(json.previous_league_id, seasonID);
            } else {
                alert("The season you selected does not exist for this league");
                return;
            }
        } else {
            if (json.season == "2021" && seasonID == 2021) {
                getNewSeasonSleeperSettings(leagueID, 2021);
            } else if (json.season == "2020" && seasonID == 2020) {
                getNewSeasonSleeperSettings(leagueID, 2020);
            } else if (json.season === "2020" && seasonID === 2019) {
                getSleeperLeagueSettings(json.previous_league_id, 2019);
            } else {
                if (json == null) {
                    alert("Something went wrong, make sure the leagueID was input correctly and the season you are looking up exists");
                    location.reload();
                    return;
                }
                // tslint:disable-next-line: no-console
                console.log(json);
                const rosters = convertSleeperRoster(json.roster_positions, json.settings.reserve_slots, json.settings.taxi_slots);
                const lineupOrder = json.roster_positions.filter((it) => it !== "BN");
                const leagueName = json.name;
                const leagueAvatar = json.avatar;
                const draftId = json.draft_id;
                const playoffStartWeek = json.settings.playoff_week_start;
                const currentMatchupPeriod = json.settings.last_scored_leg;
                const previousLeagueId = json.previous_league_id;
                const numDivisions = json.settings.divisions;
                const draft = new SleeperDraftInfo(draftId, DRAFT_TYPE.SNAKE);
                const activeLineupSlots = rosters[0];
                const lineupSlots = rosters[0].concat(rosters[1]);
                const playoffType = json.settings.playoff_type;
                const numPlayoffTeams = json.settings.playoff_teams;
                // Not working for some reason on sleepers end
                const startWeek = json.settings.start_week;
                const isActive = (json.status === "in_season" || json.status === "post_season");
                const scoringSettings: SleeperScoringSettings = json.scoring_settings;
                const divisions = [];
                if (json.metadata) {
                    for (let i = 0; i < numDivisions; i++) {
                        divisions.push((json.metadata["division_" + (i + 1)], json.metadata["division_" + (i + 1) + "_avatar"]));
                    }
                }
                const durationSettings = new SleeperSeasonDurationSettings(startWeek,
                    16 - (16 - playoffStartWeek),
                    16 - playoffStartWeek, currentMatchupPeriod,
                    json.settings.last_scored_leg,
                    isActive,
                    [seasonID],
                    playoffType,
                    numPlayoffTeams
                    );
    
                const leagueInfo = new SleeperLeagueInfo(leagueName, leagueID, seasonID, [seasonID], leagueAvatar, previousLeagueId);
                const rosterInfo = new PositionInfo(activeLineupSlots, lineupSlots, lineupOrder);
                const settings = new SleeperSettings(scoringSettings, durationSettings, leagueInfo, draft, rosterInfo);
                settings.positionInfo.excludedLineupSlots.push(88);
                updateLoadingText("Getting Members");
                getSleeperMembers(settings);
            }
        }
    });
}

function getNewSeasonSleeperSettings(leagueId: string, seasonID: number) {
    sleeper_request("get", {
        path: "league/" + leagueId.toString()
    }).done((json: SleeperLeagueResponse) => {
            if (json == null) {
                alert("Something went wrong, make sure the leagueID was input correctly and the season you are looking up exists");
                location.reload();
                return;
            }
            // tslint:disable-next-line: no-console
            console.log(json);
            const rosters = convertSleeperRoster(json.roster_positions, json.settings.reserve_slots, json.settings.taxi_slots);
            const lineupOrder = json.roster_positions.filter((it) => it !== "BN");
            const leagueName = json.name;
            const leagueAvatar = json.avatar;
            const draftId = json.draft_id;
            const playoffStartWeek = json.settings.playoff_week_start;
            const currentMatchupPeriod = json.settings.last_scored_leg;
            const previousLeagueId = json.previous_league_id;
            const numDivisions = json.settings.divisions;
            const draft = new SleeperDraftInfo(draftId, DRAFT_TYPE.SNAKE);
            const activeLineupSlots = rosters[0];
            const lineupSlots = rosters[0].concat(rosters[1]);
            const playoffType = json.settings.playoff_type;
            const numPlayoffTeams = json.settings.playoff_teams;
            // Not working for some reason on sleepers end
            const startWeek = json.settings.start_week;
            const isActive = (json.status === "in_season" || json.status === "post_season");
            const scoringSettings: SleeperScoringSettings = json.scoring_settings;
            const divisions = [];
            if (json.metadata) {
                for (let i = 0; i < numDivisions; i++) {
                    divisions.push((json.metadata["division_" + (i + 1)], json.metadata["division_" + (i + 1) + "_avatar"]));
                }
            }
            const durationSettings = new SleeperSeasonDurationSettings(startWeek,
                16 - (16 - playoffStartWeek),
                16 - playoffStartWeek, currentMatchupPeriod,
                json.settings.last_scored_leg,
                isActive,
                [seasonID],
                playoffType,
                numPlayoffTeams
                );

            const leagueInfo = new SleeperLeagueInfo(leagueName, leagueId, seasonID, [seasonID], leagueAvatar, previousLeagueId);
            const rosterInfo = new PositionInfo(activeLineupSlots, lineupSlots, lineupOrder);
            const settings = new SleeperSettings(scoringSettings, durationSettings, leagueInfo, draft, rosterInfo);
            settings.positionInfo.excludedLineupSlots.push(88);
            updateLoadingText("Getting Members");
            getSleeperMembers(settings);
    });
}

function getSleeperMembers(settings: SleeperSettings) {
    sleeper_request("get", {
        path: "league/" + settings.leagueInfo.leagueId.toString() + "/users"
    }).done((json: SleeperUserResponse[]) => {
        const members: SleeperMember[] = [];
        json.forEach((member) => {
            const memberName = member.display_name;
            const memberID = member.user_id;
            const teamName = member.metadata.team_name;
            const teamAvatar = member.avatar;
            members.push(new SleeperMember(memberID, memberName, teamName, teamAvatar));
        });
        updateLoadingText("Getting Rosters");
        getSleeperRosters(members, settings);
    });
}

function getSleeperRosters(members: SleeperMember[], settings: SleeperSettings) {
    sleeper_request("get", {
        path: "league/" + settings.leagueInfo.leagueId.toString() + "/rosters/"
    }).done((json: SleeperRosterResponse[]) => {
        json.forEach((roster) => {
            const teamID = parseInt(roster.roster_id, 10);
            const metadata = roster.metadata;
            const curRoster = roster.players;
            const reserve = roster.reserve;
            const taxi = roster.taxi;
            const wins = roster.settings.wins;
            const totalMoves = roster.settings.total_moves;
            const rosterOwnerID = roster.owner_id.toString();
            const coOwners = roster.co_owners;
            members.forEach((member) => {
                let totalRoster = [];
                totalRoster = curRoster;
                if (member.memberID === rosterOwnerID) {
                    member.teamID = teamID;
                    member.stats = new Stats(0);
                    // if (reserve !== null) {
                    //     totalRoster = totalRoster.concat(reserve);
                    // }
                    // if (taxi !== null) {
                    //     totalRoster = totalRoster.concat(taxi);
                    // }
                    member.currentRosterIDs = totalRoster;
                    if (metadata != null) {
                        for (const [key, value] of Object.entries(metadata)) {
                            member.rosterNicknameMap.set(key, value as string);
                        }
                    }
                }
            });
        });
        console.log(settings);
        updateLoadingText("Getting Matchups");
        if (settings.leagueInfo.seasonId == 2020) {
            getSleeper2020Matchups(members.filter((member) => member.teamID !== undefined), settings);
        } else {
            getSleeperMatchups(members.filter((member) => member.teamID !== undefined), settings);
        }
        
    });
}

function getSleeper2020Matchups(members: SleeperMember[], settings: SleeperSettings) {
    const promises = [];
    if (settings.seasonDuration.currentMatchupPeriod !== 0) {
        for (let i = settings.seasonDuration.startWeek; i <= settings.seasonDuration.currentMatchupPeriod; i++) {
            promises.push(makeRequest("https://api.sleeper.app/v1/league/" + settings.leagueInfo.leagueId + "/matchups/" + i));
        }
        updateLoadingText("Getting weekly stats");
        let weekCounter = settings.seasonDuration.startWeek;
        const Weeks: Week[] = [];
        Promise.all(promises).then((weeks) => {
            weeks.forEach((week) => {
                const isPlayoffs = (weekCounter > settings.seasonDuration.regularSeasonLength);
                const weekMatches = getSleeperWeekMatchups(week.response, weekCounter, isPlayoffs, settings.positionInfo.lineupOrder, settings.leagueInfo.seasonId);
                Weeks.push(new Week(weekCounter, isPlayoffs, weekMatches));
                weekCounter += 1;
            });
            getSleeper2020WeekStats(settings.seasonDuration.startWeek, settings.seasonDuration.currentMatchupPeriod).then((result) => {
                for (let y = 0; y < result.length; y++) {
                    (Weeks as Week[])[y].matchups.forEach((matchup) => {
                        matchup.home.lineup.forEach((player) => {
                            (result[y] as SleeperWeekStats).calculatePlayerScore(settings.scoringSettings, player);
                            (result[y] as SleeperWeekStats).calculateProjectedPlayerScore(settings.scoringSettings, player);
                        });
                        if (matchup.home.score === null) {
                            matchup.home.score = matchup.home.getTeamScore(matchup.home.lineup);
                            matchup.setMatchupStats();
                        }
                        matchup.home.bench.forEach((player) => {
                            (result[y] as SleeperWeekStats).calculatePlayerScore(settings.scoringSettings, player);
                            (result[y] as SleeperWeekStats).calculateProjectedPlayerScore(settings.scoringSettings, player);
                        });

                        if (!matchup.byeWeek) {
                            matchup.away.lineup.forEach((player: SleeperPlayer) => {
                                (result[y] as SleeperWeekStats).calculatePlayerScore(settings.scoringSettings, player);
                                (result[y] as SleeperWeekStats).calculateProjectedPlayerScore(settings.scoringSettings, player);
                            });
                            if (matchup.away.score === null) {
                                matchup.away.score = matchup.away.getTeamScore(matchup.away.lineup);
                                matchup.setMatchupStats();
                            }
                            matchup.away.bench.forEach((player: SleeperPlayer) => {
                                (result[y] as SleeperWeekStats).calculatePlayerScore(settings.scoringSettings, player);
                                (result[y] as SleeperWeekStats).calculateProjectedPlayerScore(settings.scoringSettings, player);
                            });
                        }
                    });
                }
                assignAllPlayerAttributes(Weeks, settings, members);
            });
        });
    } else {
        console.log("Getting player stats skipped");
        assignAllPlayerAttributes([], settings, members);
    }
}

function getSleeperMatchups(members: SleeperMember[], settings: SleeperSettings) {
    const promises = [];
    if (settings.seasonDuration.currentMatchupPeriod !== 0) {
        for (let i = settings.seasonDuration.startWeek; i <= settings.seasonDuration.lastScoredLeg; i++) {
            promises.push(makeRequest("https://api.sleeper.app/v1/league/" + settings.leagueInfo.leagueId + "/matchups/" + i));
        }
        updateLoadingText("Getting weekly stats");
        let weekCounter = 1;
        const Weeks: Week[] = [];
        Promise.all(promises).then((weeks) => {
            weeks.forEach((week) => {
                const isPlayoffs = (weekCounter > settings.seasonDuration.regularSeasonLength);
                const weekMatches = getSleeperWeekMatchups(week.response, weekCounter, isPlayoffs, settings.positionInfo.lineupOrder, settings.leagueInfo.seasonId);
                Weeks.push(new Week(weekCounter, isPlayoffs, weekMatches));
                weekCounter += 1;
            });
            getSleeperWeekStats(settings.seasonDuration.startWeek, settings.seasonDuration.lastScoredLeg, settings.leagueInfo.seasonId).then((result) => {
                for (let y = 0; y < result.length; y++) {
                    (Weeks as Week[])[y].matchups.forEach((matchup) => {
                        matchup.home.lineup.forEach((player) => {
                            (result[y] as SleeperWeekStats).calculatePlayerScore(settings.scoringSettings, player);
                            (result[y] as SleeperWeekStats).calculateProjectedPlayerScore(settings.scoringSettings, player);
                        });
                        if (matchup.home.score === null) {
                            matchup.home.score = matchup.home.getTeamScore(matchup.home.lineup);
                            matchup.setMatchupStats();
                        }
                        matchup.home.bench.forEach((player) => {
                            (result[y] as SleeperWeekStats).calculatePlayerScore(settings.scoringSettings, player);
                            (result[y] as SleeperWeekStats).calculateProjectedPlayerScore(settings.scoringSettings, player);
                        });

                        if (!matchup.byeWeek) {
                            matchup.away.lineup.forEach((player: SleeperPlayer) => {
                                (result[y] as SleeperWeekStats).calculatePlayerScore(settings.scoringSettings, player);
                                (result[y] as SleeperWeekStats).calculateProjectedPlayerScore(settings.scoringSettings, player);
                            });
                            if (matchup.away.score === null) {
                                matchup.away.score = matchup.away.getTeamScore(matchup.away.lineup);
                                matchup.setMatchupStats();
                            }
                            matchup.away.bench.forEach((player: SleeperPlayer) => {
                                (result[y] as SleeperWeekStats).calculatePlayerScore(settings.scoringSettings, player);
                                (result[y] as SleeperWeekStats).calculateProjectedPlayerScore(settings.scoringSettings, player);
                            });
                        }
                    });
                }
                assignAllPlayerAttributes(Weeks, settings, members);
            });
        });
    } else {
        console.log("Getting player stats skipped");
        assignAllPlayerAttributes([], settings, members);
    }
}

function getSleeperWeekMatchups(teams: SleeperTeamResponse[], weekNumber: number, isPlayoff: boolean, lineupOrder: string[], seasonID: number): Matchup[] {
    const allTeams = (teams).map((team: SleeperTeamResponse) => {
        return new SleeperTeam(team.starters, team.players, team.points, team.matchup_id, team.roster_id, findOpponent(teams, team.roster_id, team.matchup_id), weekNumber, lineupOrder);
    });
    const matchups = [];
    for (let i = 0; i <= (teams.length / 2); i++) {
        const curTeams = allTeams.filter((team) => {
            return team.matchupID === i;
        });
        if (curTeams.length === 1) {
            matchups.push(new Matchup(curTeams[0], null, weekNumber, isPlayoff));
        }
        if (curTeams.length === 2) {
            matchups.push(new Matchup(curTeams[0], curTeams[1], weekNumber, isPlayoff));
        }
    }

    const byeWeekTeams = allTeams.filter((team) => {
        return team.matchupID === null;
    });
    byeWeekTeams.forEach((team) => {
        matchups.push(new Matchup(team, null, weekNumber, isPlayoff));
    });

    return matchups;
}

function assignAllPlayerAttributes(weeks: Week[], settings: SleeperSettings, members: SleeperMember[]) {
    updateLoadingText("Getting Player Stats");
    let playerlib = "./assets/player_library.json";
    if (settings.leagueInfo.seasonId == 2020) {
        playerlib = "./assets/sleeper2020players.json";
    } else if (settings.leagueInfo.seasonId === 2021) {
        playerlib = "./assets/2021/player_library.json";
    }
    makeRequest(playerlib).then((result) => {
        const lib = (result.response as SleeperPlayerLibrary);
        weeks.forEach((week) => {
            week.matchups.forEach((matchup) => {
                if (matchup.home.score === null) {
                    matchup.home.score = matchup.home.getTeamScore(matchup.home.lineup);
                    matchup.setMatchupStats();
                }
                if (!matchup.byeWeek) {
                    if (matchup.away.score === null) {
                        matchup.away.score = matchup.home.getTeamScore(matchup.away.lineup);
                        matchup.setMatchupStats();
                    }
                }
                matchup.home.lineup.forEach((player) => {
                    assignSleeperPlayerAttributes(player as SleeperPlayer, lib[player.playerID]);
                });
                matchup.home.bench.forEach((player) => {
                    assignSleeperPlayerAttributes(player as SleeperPlayer, lib[player.playerID]);
                });
                matchup.home.IR.forEach((player) => {
                    assignSleeperPlayerAttributes(player as SleeperPlayer, lib[player.playerID]);
                });
                (matchup.home as SleeperTeam).setTeamMetrics(settings.positionInfo.activeLineupSlots, settings.positionInfo.excludedLineupSlots, settings.positionInfo.excludedPositions);
                if (!matchup.byeWeek) {
                    matchup.away.lineup.forEach((player: SleeperPlayer) => {
                        assignSleeperPlayerAttributes(player, lib[player.playerID]);
                    });
                    matchup.away.bench.forEach((player: SleeperPlayer) => {
                        assignSleeperPlayerAttributes(player, lib[player.playerID]);
                    });
                    matchup.away.IR.forEach((player: SleeperPlayer) => {
                        assignSleeperPlayerAttributes(player, lib[player.playerID]);
                    });
                    (matchup.away as SleeperTeam).setTeamMetrics(settings.positionInfo.activeLineupSlots, settings.positionInfo.excludedLineupSlots, settings.positionInfo.excludedPositions);
                    matchup.projectedMOV = (Math.abs(matchup.home.projectedScore - matchup.away.projectedScore));
                    matchup.setPoorLineupDecisions();
                }
            });
        });
        members.forEach((member) => {
            member.setRosterAttributes(lib);
        });
        let league;

        if (settings.leagueInfo.seasonId === 2021) {
            league = new SleeperLeague(weeks, members, settings);
            updateLoadingText("Setting Page");
            league.setMemberStats(league.getSeasonPortionWeeks());
        } else {
            league = new SleeperLeague(weeks, members, settings);
            updateLoadingText("Setting Page");
            league.setMemberStats(league.getSeasonPortionWeeks());
        }
        getSleeperTrades(league, lib);
    });
}

function getSleeperTrades(league: SleeperLeague, lib: SleeperPlayerLibrary) {
    const promises = [];
    if (league.season === 2020) {
        promises.push(makeRequest("https://api.sleeper.app/v1/league/" + league.id + "/transactions/1"));
    } else {
        for (let i = 1; i <= league.settings.seasonDuration.currentMatchupPeriod - 1; i++) {
            promises.push(makeRequest("https://api.sleeper.app/v1/league/" + league.id + "/transactions/" + i));
        }
    }
    updateLoadingText("Getting Transactions");
    Promise.all(promises).then((transactionArray) => {
        transactionArray.map((it) => it.response).forEach((week) => {
            week.filter((it: SleeperTransactionResponse) => it.type === "trade" && it.status === "complete").forEach((trade: SleeperTransactionResponse) => {
                if (trade.consenter_ids.some(x => x > league.members.length) == false) {
                    league.trades.push(new SleeperTrade(trade, lib));
                }
            });
        });
        if (league.settings.leagueInfo.seasonId === 2021) {
            league.setPage();
        } else {
            getPlayoffBrackets(league);
        }
    });
}

function getPlayoffBrackets(league: SleeperLeague) {
    if (league.season != 2021) {
        const promises = [];
        promises.push(makeRequest("https://api.sleeper.app/v1/league/" + league.id + "/winners_bracket"));
        promises.push(makeRequest("https://api.sleeper.app/v1/league/" + league.id + "/losers_bracket"));
    
        Promise.all(promises).then((bracketArray) => {
            const winBracket = bracketArray[0].response;
            const loseBracket = bracketArray[1].response;
            setSleeperRanks(league, winBracket, loseBracket);
            league.setPage();
        });
    }
}

function setSleeperRanks(league: SleeperLeague, winners_bracket: SleeperPlayoffResponse[], losers_bracket: SleeperPlayoffResponse[]) {
    // Playoff Type 1 = Consolation Bracket
    // Playoff Type 2 = Toilet Bowl
    let playoffTeams = league.settings.seasonDuration.numPlayoffTeams;
    winners_bracket.forEach((winBracket) => {
        if (winBracket.hasOwnProperty("p")) {
            const winnerId = winBracket.w;
            const loserId = winBracket.l;
            const winRank = winBracket.p;
            const loseRank = winBracket.p + 1;
            league.getMember(winnerId).stats.finalStanding = winRank;
            league.getMember(loserId).stats.finalStanding = loseRank;
        }
    });

    losers_bracket.forEach((loseBracket) => {
        if (loseBracket.hasOwnProperty("p")) {
            const winnerId = loseBracket.w;
            const loserId = loseBracket.l;
            let winRank;
            let loseRank;

            // When consolation bracket the start position becomes the best possible finish position and increments up
            if (league.settings.seasonDuration.playoffType === 1) {
                let loseBracketStartPosition = league.members.length - (league.members.length - playoffTeams);
                winRank = loseBracketStartPosition + loseBracket.p;
                loseRank = loseBracketStartPosition + loseBracket.p + 1;

            // When toilet bowl we subtract the bracket finish position from league size
            } else {
                winRank = league.members.length - loseBracket.p + 1;
                loseRank = league.members.length - loseBracket.p;
            }
            league.getMember(winnerId).stats.finalStanding = winRank;
            league.getMember(loserId).stats.finalStanding = loseRank;
        }
    });
}
