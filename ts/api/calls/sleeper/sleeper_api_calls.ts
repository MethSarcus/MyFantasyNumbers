function getSleeperLeagueSettings(leagueID: string, seasonID: number) {
    sleeper_request("get", {
        path: "league/" + leagueID.toString()
    }).done((json: SleeperLeagueResponse) => {
        if (json.season === "2020") {
            getSleeperLeagueSettings(json.previous_league_id, seasonID);
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
            // Not working for some reason on sleepers end
            // const startWeek = json.settings.start_week;
            const startWeek = 1;
            const isActive = (json.status === "in_season" || json.status === "post_season");
            const scoringSettings: SleeperScoringSettings = json.scoring_settings;
            const divisions = [];
            if (json.metadata) {
                for (let i = 0; i < numDivisions; i++) {
                    divisions.push((json.metadata["division_" + (i + 1)], json.metadata["division_" + (i + 1) + "_avatar"]));
                }
            }
            const settings = new Settings(startWeek, rosters[0], rosters[0].concat(rosters[1]), 16 - (16 - playoffStartWeek), 16 - playoffStartWeek, DRAFT_TYPE.SNAKE, currentMatchupPeriod, isActive, [seasonID]);
            settings.excludedLineupSlots.push(88);
            updateLoadingText("Getting Members");
            getSleeperMembers(leagueID, seasonID, settings, scoringSettings, lineupOrder, leagueName, json.settings.last_scored_leg);
        }
    });
}

function getSleeperMembers(leagueID: string, seasonID: number, settings: Settings, scoringSettings: SleeperScoringSettings, lineupOrder: string[], leagueName: string, lastScoredLeg: number) {
    sleeper_request("get", {
        path: "league/" + leagueID.toString() + "/users"
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
        getSleeperRosters(leagueID, seasonID, members, settings, scoringSettings, lineupOrder, leagueName, lastScoredLeg);
    });
}

function getSleeperRosters(leagueID: string, seasonID: number, members: SleeperMember[], settings: Settings, scoringSettings: SleeperScoringSettings, lineupOrder: string[], leagueName: string, lastScoredLeg: number) {
    sleeper_request("get", {
        path: "league/" + leagueID.toString() + "/rosters/"
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
        updateLoadingText("Getting Matchups");
        getSleeperMatchups(leagueID, seasonID, members.filter((member) => member.teamID !== undefined), settings, scoringSettings, lineupOrder, leagueName, lastScoredLeg);
    });
}

function getSleeperMatchups(leagueID: string, seasonID: number, members: SleeperMember[], settings: Settings, scoringSettings: SleeperScoringSettings, lineupOrder: string[], leagueName: string, lastScoredLeg: number) {
    const promises = [];
    for (let i = settings.startWeek; i <= lastScoredLeg; i++) {
        promises.push(makeRequest("https://api.sleeper.app/v1/league/" + leagueID + "/matchups/" + i));
    }
    updateLoadingText("Getting weekly stats");
    let weekCounter = settings.startWeek;
    const Weeks: Week[] = [];
    Promise.all(promises).then((weeks) => {
        weeks.forEach((week) => {
            const isPlayoffs = (weekCounter >= settings.regularSeasonLength);
            const weekMatches = getSleeperWeekMatchups(week.response, weekCounter, isPlayoffs, lineupOrder);
            Weeks.push(new Week(weekCounter, isPlayoffs, weekMatches));
            weekCounter += 1;
        });

        getSleeperWeekStats(settings.startWeek, lastScoredLeg).then((result) => {
            for (let y = 0; y < result.length; y++) {
                (Weeks as Week[])[y].matchups.forEach((matchup) => {
                    matchup.home.lineup.forEach((player) => {
                        (result[y] as SleeperWeekStats).calculatePlayerScore(scoringSettings, player);
                        (result[y] as SleeperWeekStats).calculateProjectedPlayerScore(scoringSettings, player);
                    });
                    if (matchup.home.score === null) {
                        matchup.home.score = matchup.home.getTeamScore(matchup.home.lineup);
                        matchup.setMatchupStats();
                    }
                    matchup.home.bench.forEach((player) => {
                        (result[y] as SleeperWeekStats).calculatePlayerScore(scoringSettings, player);
                        (result[y] as SleeperWeekStats).calculateProjectedPlayerScore(scoringSettings, player);
                    });

                    if (!matchup.byeWeek) {
                        matchup.away.lineup.forEach((player: SleeperPlayer) => {
                            (result[y] as SleeperWeekStats).calculatePlayerScore(scoringSettings, player);
                            (result[y] as SleeperWeekStats).calculateProjectedPlayerScore(scoringSettings, player);
                        });
                        if (matchup.away.score === null) {
                            matchup.away.score = matchup.away.getTeamScore(matchup.away.lineup);
                            matchup.setMatchupStats();
                        }
                        matchup.away.bench.forEach((player: SleeperPlayer) => {
                            (result[y] as SleeperWeekStats).calculatePlayerScore(scoringSettings, player);
                            (result[y] as SleeperWeekStats).calculateProjectedPlayerScore(scoringSettings, player);
                        });
                    }
                });
            }
            assignAllPlayerAttributes(Weeks, settings.activeLineupSlots, settings, leagueID, seasonID, members, leagueName);
        });
    });
}

function getSleeperWeekMatchups(teams: SleeperTeamResponse[], weekNumber: number, isPlayoff: boolean, lineupOrder: string[]): Matchup[] {
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

function assignAllPlayerAttributes(weeks: Week[], activeLineupSlots: number[][], settings: Settings, leagueID: string, seasonID: number, members: SleeperMember[], leagueName: string) {
    updateLoadingText("Getting Player Stats");
    makeRequest("./assets/player_library.json").then((result) => {
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
                (matchup.home as SleeperTeam).setTeamMetrics(activeLineupSlots, settings.excludedLineupSlots, settings.excludedPositions);
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
                    (matchup.away as SleeperTeam).setTeamMetrics(activeLineupSlots, settings.excludedLineupSlots, settings.excludedPositions);
                    matchup.projectedMOV = (Math.abs(matchup.home.projectedScore - matchup.away.projectedScore));
                    matchup.setPoorLineupDecisions();
                }
            });
        });
        members.forEach((member) => {
            member.setRosterAttributes(lib);
        });

        const league = new SleeperLeague(leagueID, seasonID, weeks, members, settings, leagueName, PLATFORM.SLEEPER);
        updateLoadingText("Setting Page");
        league.setMemberStats(league.getSeasonPortionWeeks());
        getSleeperTrades(league, lib);
    });
}

function getSleeperTrades(league: SleeperLeague, lib: SleeperPlayerLibrary) {
    const promises = [];
    for (let i = 1; i <= league.settings.currentMatchupPeriod - 1; i++) {
        promises.push(makeRequest("https://api.sleeper.app/v1/league/" + league.id + "/transactions/" + i));
    }
    updateLoadingText("Getting Transactions");
    Promise.all(promises).then((transactionArray) => {
        transactionArray.map((it) => it.response).forEach((week) => {
            week.filter((it: SleeperTransactionResponse) => it.type === "trade" && it.status === "complete").forEach((trade: SleeperTransactionResponse) => {
                league.trades.push(new SleeperTrade(trade, lib));
            });
        });
        league.setPage();
    });
}
