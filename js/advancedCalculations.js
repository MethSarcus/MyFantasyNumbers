//add number of matchups projected to win and number of upsets

//params: year object
//returns: updated members
function setPowerRankings(members){
    for (i = 0; i < members.length; i++){
        let curMember = members[i];
        let totalWins = 0;
        let totalLosses = 0;
        //loop thrugh pastweeks of the current member
        //console.log(curMember);
        for (x = 0; x < curMember.pastWeeks.length; x++){
            //console.log(curMember.pastWeeks[x]);
            let curWeek = curMember.pastWeeks[x];
            let curWeekScore = curWeek.activeScore;
            //loop through all opponents to check how many matchups you would win
            for (y = 0; y < members.length; y++){
                let curOpponent = members[y];
                if (curOpponent.memberID != curMember.memberID){
                    let curOpponentScore = curOpponent.pastWeeks[x].activeScore;
                    if (curWeekScore < curOpponentScore){
                        curWeek.powerRank += 1;
                        totalLosses += 1;
                        curWeek.powerLosses += 1;
                    }

                    else if (curWeekScore > curOpponentScore) {
                        totalWins += 1;
                        curWeek.powerWins +=1;
                    }
                }
                curWeek.powerPct = curWeek.powerWins/curWeek.powerLosses;
            }
        }
        curMember.powerWins = totalWins;
        curMember.powerLosses = totalLosses;
        curMember.powerPct = roundToHundred(totalWins/(totalLosses + totalWins));
    }
    for (i = 0; i < members.length; i++){
        let curMember = members[i];
        console.log(curMember.powerRank);
        for (y = 0; y < members.length; y++){
            let curOpponent = members[y];
            if (curOpponent.memberID != curMember.memberID){
                if (curOpponent.powerWins > curMember.powerWins){
                    curMember.powerRank += 1;
                }

            }
        }
    }
    console.log(members);
    return members
}


