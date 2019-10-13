function getSleeperLeagueSettings(leagueID: string, seasonID: number) {
    sleeper_request('get', {
        path: 'league/' + leagueID.toString()
    }).done(function (json) {
        console.log(json);
        const rosters = convertSleeperRoster(json.roster_positions, json.settings.reserve_slots, json.settings.taxi_slots);
        const leagueName = json.name;
        const leagueAvatar = json.avatar
        const draftId = json.draft_id;
        const playoffStartWeek = json.settings.playoff_week_start;
        const currentMatchupPeriod = json.settings.leg;
        const previousLeagueId = json.previous_league_id;
        const numDivisions = json.settings.divisions;
        const isActive = (json.status == "in_season");
        const scoring_settings = json.scoring_settings;
        var divisions = [];
        for(var i = 0; i < numDivisions; i++) {
            divisions.push((json.metadata["division_" + (i + 1)], json.metadata["division_" + (i + 1) + "_avatar"]));
        }
        const settings = new Settings(rosters[0], rosters[0].concat(rosters[1]), 16, 16 - playoffStartWeek, "", currentMatchupPeriod, isActive, [seasonID]);
        getSleeperMembers(leagueID, seasonID, settings, scoring_settings);
    });
}

function getSleeperMembers(leagueID: string, seasonID: number, settings: Settings, scoring_settings: object) {
    sleeper_request('get', {
        path: 'league/' + leagueID.toString() + '/users'
    }).done(function (json) {
        var members = [];
        json.forEach(member => {
            let memberName = member.display_name;
            let memberID = member.user_id;
            let teamName = member.metadata.teamName;
            let teamAvatar = member.avatar;
            members.push(new Sleeper_Member(memberID, memberName, teamName, teamAvatar));
        });
        getSleeperRosters(leagueID, seasonID, members, settings, scoring_settings);
    });
}

function getSleeperRosters(leagueID: string, seasonID: number, members: Sleeper_Member[], settings: Settings, scoring_settings) {
    sleeper_request('get', {
        path: 'league/' + leagueID.toString() + '/rosters/'
    }).done(function (json) {
        console.log(json);
        json.forEach(roster => {
            let teamID = roster.roster_id;
            let wins = roster.settings.wins;
            let totalMoves = roster.settings.totalMoves;
            let rosterOwnerID = roster.owner_id;
            let leagueID = roster.league_id;
            let coOwners = roster.co_owners;
            members.forEach(member => {
                if (member.memberID == rosterOwnerID) {
                    member.teamID = teamID;
                    member.stats = new Stats(0);
                }
            });
        });

        getSleeperMatchups(leagueID, seasonID, members, settings, scoring_settings);
    });
}

function getSleeperMatchups(leagueID: string, seasonID: number, members: Sleeper_Member[], settings: Settings, scoring_settings) {
    console.log("getting matchups");
    var weeksToGet;
    if (settings.currentMatchupPeriod < settings.regularSeasonLength + settings.playoffLength) {
        weeksToGet = settings.currentMatchupPeriod - 1;
    } else {
        weeksToGet = settings.regularSeasonLength + settings.playoffLength;
    }
    var promises = [];
    for (var i = 1; i <= weeksToGet; i++) {
        promises.push(makeRequest('https://api.sleeper.app/v1/league/' + leagueID + '/matchups/' + i));
    }
    var weekCounter = 1;
    var Weeks = [];
    Promise.all(promises).then(weeks => {
        weeks.forEach(week => {
            var isPlayoffs = (weekCounter > settings.regularSeasonLength);
            var weekMatches = getSleeperWeekMatchups(week.response, settings.activeLineupSlots, weekCounter, isPlayoffs);
            Weeks.push(new Week(weekCounter, isPlayoffs, weekMatches));
            weekCounter += 1;
        });

        getSleeperWeekStats(weeksToGet).then(result => {
            console.log(result);
            for (var y = 0; y < result.length; y++) {
                (Weeks as Week[])[y].matchups.forEach(matchup => {
                    matchup.home.lineup.forEach(player => {
                        (result[y] as Sleeper_Week_Stats).calculatePlayerScore(scoring_settings, player);
                        (result[y] as Sleeper_Week_Stats).calculateProjectedPlayerScore(scoring_settings, player);
                    });
                    matchup.home.bench.forEach(player => {
                        (result[y] as Sleeper_Week_Stats).calculatePlayerScore(scoring_settings, player);
                        (result[y] as Sleeper_Week_Stats).calculateProjectedPlayerScore(scoring_settings, player);
                    });

                    if (!matchup.byeWeek) {
                        matchup.away.lineup.forEach(player => {
                            (result[y] as Sleeper_Week_Stats).calculatePlayerScore(scoring_settings, player);
                            (result[y] as Sleeper_Week_Stats).calculateProjectedPlayerScore(scoring_settings, player);
                        });
                        matchup.away.bench.forEach(player => {
                            (result[y] as Sleeper_Week_Stats).calculatePlayerScore(scoring_settings, player);
                            (result[y] as Sleeper_Week_Stats).calculateProjectedPlayerScore(scoring_settings, player);
                        });
                    }
                });
                
            }
            console.log(Weeks);
            return result;
        });
    })
    .catch(error => { 
        console.error(error.message)
      });
}

function getSleeperWeekMatchups(teams: Team_Response[], activeLineupSlots, weekNumber: number, isPlayoff: boolean): Matchup[] {
    
    var allTeams = (teams as any).map(team => {
        return new Sleeper_Team(team.starters, team.players, team.points, team.matchup_id, team.roster_id, findOpponent(teams, team.roster_id, team.matchup_id), activeLineupSlots);
    });
    var matchups = [];
    for (var i = 0; i < (teams.length/2); i++) {
        let curTeams = allTeams.filter(team => {
            return team.matchupID == i;
        });
        if (curTeams.length == 1) {
            matchups.push(new Matchup(curTeams[0], null, weekNumber, isPlayoff));
        }
        if (curTeams.length == 2) {
            matchups.push(new Matchup(curTeams[0], curTeams[1], weekNumber, isPlayoff));
        }
    }
    return matchups;
}

function findOpponent(teams: Team_Response[], roster_id: number, matchup_id: number): number {
    var opponent_roster_id = -1;
    teams.forEach(team => {
        if (team.matchup_id == matchup_id && team.roster_id != roster_id) {
            opponent_roster_id = team.roster_id;
        }
    });

    return opponent_roster_id;
}