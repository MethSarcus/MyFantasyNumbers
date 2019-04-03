//add number of matchups projected to win and number of upsets

//params: year object
//returns: powerrankobject
function setPowerRankings(members){
    for (i = 0; i < members.length; i++){
        let curMember = members[i];
        let totalWins = 0;
        let totalLosses = 0;
        //loop thrugh pastweeks of the current member
        for (x = 0; x = curMember.pastWeeks.length; x++){
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
                    }
                }
                
            }
        }
    }
}

function retrievePowerRankList(members){
    for (i = 0; i < members.length; i++){
        let curMember = members[i];

    }
}

