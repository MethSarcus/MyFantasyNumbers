// $(document).ready(() => {
//     document.getElementById("info_form").addEventListener("click", function(event){
//         event.preventDefault()
//       });
//     const input = prompt("Please enter League ID", "2319896");
//     const season = prompt("Please enter year", "2018");

//     if (input != null) {
//         const leagueID = input;
//         if (localStorage.getItem(leagueID + season)) {
//             const year = JSON.parse(localStorage.getItem(leagueID + season));
//             const restoredLeague = League.convertESPNFromJson(year);
//             setPage(restoredLeague);
//         } else {
//             localStorage.clear();
//             if (leagueID.length > 9) {
//                 getSleeperLeagueSettings(leagueID, parseInt(season, 10));
//             } else {
//                 getESPNSettings(leagueID, season);
//             }
//         }
//     }
// });
