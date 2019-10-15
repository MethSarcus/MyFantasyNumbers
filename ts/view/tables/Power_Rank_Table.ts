function createPowerRankTable(league: League) {
    const tableBody: HTMLTableElement = document.getElementById("power_rank_table_body") as HTMLTableElement;
    league.members.forEach((member) => {
        const row = document.createElement("tr");
        const teamName = document.createElement("td");
        const powerRank = document.createElement("td");
        const powerRecord = document.createElement("td");
        const winPct = document.createElement("td");
        const potentialRecord = document.createElement("td");
        const potentialWinPct = document.createElement("td");
        const image = document.createElement("img");

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
}
