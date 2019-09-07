declare var fixNoImage: any;
function createPowerRankTable(league: League) {
    var tableBody: HTMLTableElement = <HTMLTableElement> document.getElementById("power_rank_table_body");
    league.members.forEach(member => {
        var row = document.createElement('tr');
        var teamName = document.createElement('td');
        var powerRank = document.createElement('td');
        var powerRecord = document.createElement('td');
        var winPct = document.createElement('td');
        var potentialRecord = document.createElement('td');
        var potentialWinPct = document.createElement('td');
        
        let image = document.createElement('img');
        image.src = member.logoURL;
        image.style.width = "25px";
        image.style.height = "25px";
        image.style.borderRadius = "25px";
        image.addEventListener("error", fixNoImage);
        image.style.marginRight = "8px";

        teamName.appendChild(image);
        teamName.appendChild(document.createTextNode(member.nameToString())); 
        powerRank.innerText = member.stats.powerRank.toString();
        powerRecord.innerText = member.powerRecordToString();
        potentialRecord.innerText = member.potentialPowerRecordToString();
        winPct.innerText = member.stats.getPowerWinPct() + "%";
        potentialWinPct.innerText = member.stats.getPotentialPowerWinPct() + "%";
        
        row.appendChild(powerRank);
        row.appendChild(teamName);
        row.appendChild(powerRecord);
        row.appendChild(winPct);
        row.appendChild(potentialRecord);
        row.appendChild(potentialWinPct);
        tableBody.appendChild(row);

    });
    

    // powerRanks.forEach(weekPowerRanks => {
    //     weekPowerRanks.powerStats.forEach(teamPowerStats => {
            
    //     });
    // });
}