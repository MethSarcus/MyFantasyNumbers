
// var newDraft = new LeagueDraft();
// $(document).ready(function () {
//     myXhr('get', {path: 'apis/v3/games/ffl/seasons/2018/segments/0/leagues/340734?view=mDraftDetail'}, '').done(function (json) {
//         //console.log("Draft Endpoint");
//         //console.log(json);

        
//         newDraft.leagueID = json.id;
//         newDraft.seasonID = json.seasonId;
//         newDraft.draftType = json.settings.draftSettings.type;
//         newDraft.pickOrder = json.settings.draftSettings.pickOrder;
//         newDraft.auctionBudget = json.settings.draftSettings.auctionBudget;
        
//         for (i in json.draftDetail.picks) {
//             let espnPick = json.draftDetail.picks[i];
//             let pick = new DraftPick();
//             pick.teamID = espnPick.teamId;
//             pick.memberID = espnPick.memberId;
//             pick.overallPickNumber = espnPick.overallPickNumber;
//             pick.roundID = espnPick.roundId;
//             pick.roundPickNumber = espnPick.roundPickNumber;
//             pick.playerID = espnPick.playerId;
//             pick.playerAuctionCost = espnPick.bidAmount;
//             pick.owningTeamIDs = espnPick.owningTeamIds;
//             pick.nominatingTeamID = espnPick.nominatingTeamId;
//             pick.autoDraftTypeID = espnPick.autoDraftTypeId;

//             newDraft.draftPicks.push(pick);
//         }
//     });
// });

// //console.log(newDraft);

// function myXhr(t, d, id) {
//     return $.ajax({
//         type: t,
//         url: 'js/proxy/espn_proxy.php',
//         dataType: 'json',
//         data: d,
//         cache: false,
//         async: true,
//     })
// }

