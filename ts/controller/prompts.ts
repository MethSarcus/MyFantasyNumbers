$(document).ready(function () {
    //leagueID = 340734;
    // document.getElementById("content-wrapper").onscroll = function () {
    //     console.log("triggered");
    //     scrollup()
    //   };


    var input = prompt("Please enter League ID", "2319896");
    var season = prompt("Please enter year", "2018");
    //var r = confirm("If you have not visited the league you entered this will take a few seconds to load while the data is gathered\nGood things come to those who wait!");

    if (input != null) {
        var leagueID = input;
        if (localStorage.getItem(leagueID + season)) {
            var year = JSON.parse(localStorage.getItem(leagueID + season));
            var restoredLeague = League.convertESPNFromJson(year);
            console.log(restoredLeague);
            setPage(restoredLeague);
        } else {
            console.log("running");
            localStorage.clear();
            if (leagueID.length > 9) {
                getSleeperLeagueSettings(leagueID, parseInt(season));
            } else {
                getESPNSettings(leagueID, season);
            }
            
            
            //'apis/v3/games/ffl/seasons/2018/segments/0/leagues/340734?view=mMatchupScore&teamId=1&scoringPeriodId=1' for telling if a game is a playoff game
        }
        
    }

});