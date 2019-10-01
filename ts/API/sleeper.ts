function getLeagueSettings(leagueID: number, seasonID: number) {
    myXhr('get', {
        path: 'https://api.sleeper.app/v1/league/' + leagueID.toString()
    }, '').done(function (json) {
        console.log(json);
    });
}