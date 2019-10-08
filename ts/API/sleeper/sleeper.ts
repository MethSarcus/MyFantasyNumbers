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
        console.log(rosters);
        const settings = new Settings(rosters[0], rosters[0].concat(rosters[1]), 16, 16 - playoffStartWeek, "", currentMatchupPeriod, isActive, [seasonID]);
        console.log(settings);
        getSleeperMembers(leagueID, seasonID, settings)
    });
}

function getSleeperMembers(leagueID: string, seasonID: number, settings: Settings) {
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
        getSleeperRosters(leagueID, seasonID, members, settings);
    });
}

function getSleeperRosters(leagueID: string, seasonID: number, members: Sleeper_Member[], settings: Settings) {
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
                if (member.ownerID == rosterOwnerID) {
                    member.teamID = teamID;
                    member.stats = new Stats(-1);
                }
            });
        });

        getSleeperMatchups(leagueID, seasonID, members, settings);
    });
}

function getSleeperMatchups(leagueID: string, seasonID: number, members: Sleeper_Member[], settings: Settings) {
    var weeks = [];
    console.log("getting matchups");
    var weeksToGet;
    if (settings.currentMatchupPeriod < settings.regularSeasonLength + settings.playoffLength) {
        weeksToGet = settings.currentMatchupPeriod - 1;
    } else {
        weeksToGet = settings.regularSeasonLength + settings.playoffLength;
    }
    for (let q = 1; q <= weeksToGet; q++) {
        espn_request('get', {
            path: 'league/' + leagueID.toString + '/matchups/' + q.toString()
        }).done(function (json) {
            var matchups = [];

        });
    }
}