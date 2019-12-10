function generateMatchupTable(league: League, firstTeamId: number, weekNumber: number) {
    const tableBody = document.getElementById("matchup_modal_table_body");
    const matchup = league.weeks[weekNumber - 1].getTeamMatchup(firstTeamId);
    const tableTitle = document.getElementById("matchup_modal_title");
    if (matchup.isPlayoffs) {
        tableTitle.innerText = "Week " + weekNumber.toString() + ", Playoffs";
    } else if (matchup.byeWeek) {
        tableTitle.innerText = "Week " + weekNumber.toString() + ", Bye Week";
    } else {
        tableTitle.innerText = "Week " + weekNumber.toString() + ", Regular Season";
    }
    tableBody.innerHTML = "";
    document.getElementById("matchup_modal_first_team_name").innerText = league.getMember(matchup.home.teamID).teamNameToString();
    if (!matchup.byeWeek) {
        document.getElementById("matchup_modal_second_team_name").innerText = league.getMember(matchup.away.teamID).teamNameToString();
    }

    let index = 0;
    league.settings.activeLineupSlots.forEach((slot) => {
        const slotId = slot[0];
        const slotAmount = slot[1];
        for (let i = 0; i < slotAmount; i++) {
            const firstPlayer = matchup.home.lineup[index];
            let secondPlayer;
            if (!matchup.byeWeek) {
                secondPlayer = matchup.away.lineup[index];
            } else {
                secondPlayer = new EmptySlot(slotId);
            }
            tableBody.appendChild(generateMatchupPlayerRow(firstPlayer, secondPlayer));
            index += 1;
        }
    });

}

function generateMatchupPlayerRow(player: Player, otherPlayer: Player): HTMLTableRowElement {
    const tr = document.createElement("tr");
    const margin = player.score - otherPlayer.score;
    const playerBadgeCell = generatePositionBadge(margin, player.lineupSlotID);
    let firstPlayerCell;
    let otherPlayerCell;
    try {
        firstPlayerCell = generatePlayerRowCell(player);
    } catch (error) {
        console.log(error);
        console.log(player);
    }

    try {
        otherPlayerCell = generatePlayerRowCell(otherPlayer);
    } catch (error) {
        console.log(error);
        console.log(otherPlayer);
    }

    if (margin > 0) {
        firstPlayerCell.style.borderRight = "green";
        firstPlayerCell.style.borderRightStyle = "solid";
        otherPlayerCell.style.borderLeft = "red";
        otherPlayerCell.style.borderLeftStyle = "solid";
    } else if (margin < 0) {
        otherPlayerCell.style.borderLeft = "green";
        otherPlayerCell.style.borderLeftStyle = "solid";
        firstPlayerCell.style.borderRight = "red";
        firstPlayerCell.style.borderRightStyle = "solid";
    } else {
        firstPlayerCell.style.borderRight = "green";
        firstPlayerCell.style.borderRightStyle = "solid";
        otherPlayerCell.style.borderLeft = "green";
        otherPlayerCell.style.borderLeft = "solid";
    }
    tr.appendChild(firstPlayerCell);
    tr.appendChild(playerBadgeCell);
    tr.appendChild(otherPlayerCell);

    return tr;
}

function generateTeamPlayerRow(player: Player): HTMLTableRowElement {
    const tr = document.createElement("tr");
    const firstPlayerCell = generatePlayerRowCell(player);
    tr.appendChild(firstPlayerCell);
    return tr;
}

function generatePositionBadge(marginText: number, slotID: number): HTMLTableDataCellElement {
    const td = document.createElement("td");
    td.style.textAlign = "center";
    const container = document.createElement("div");
    container.style.backgroundColor = getMemberColor(slotID);
    container.style.color = "white";
    container.classList.add("position_badge");
    const posText = document.createElement("b");
    posText.style.fontSize = "1em";
    posText.innerText = intToPosition.get(slotID);
    const margin = document.createElement("small");
    margin.innerText = roundToHundred(marginText).toString();
    container.appendChild(posText);
    td.appendChild(container);
    td.appendChild(margin);

    return td;
}

function generatePlayerRowCell(player: Player): HTMLTableDataCellElement {
    const td = document.createElement("td");
    const row = document.createElement("div");
    row.classList.add("row");
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("col-2", "pt-3");
    const image = document.createElement("img");
    let pictureURL = "";
    if (player.position === "D/ST" || player.position === "DEF") {
        pictureURL = "https://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(player.realTeamID) + ".png&h=150&w=150";
    } else {
        pictureURL = "https://a.espncdn.com/i/headshots/nfl/players/full/" + player.espnID + ".png";
    }
    image.classList.add("player_badge_image", "my-auto");
    image.src = pictureURL;
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("col-7", "pt-3");
    const boldName = document.createElement("b");
    const teamParagraph = document.createElement("p");
    boldName.innerText = player.firstName + " " + player.lastName;
    teamParagraph.innerText = player.position + " - " + getRealTeamInitials(player.realTeamID);
    const lineBreak = document.createElement("br");
    const scoreDiv = document.createElement("div");
    scoreDiv.classList.add("col-2");
    const scoreTitle = document.createElement("div");
    scoreTitle.innerText = "Score";
    scoreTitle.style.fontSize = ".8em";
    const scoreText = document.createElement("h5");
    scoreText.innerText = roundToHundred(player.score).toString();
    const projectedTitle = document.createElement("div");
    projectedTitle.innerText = "Projected";
    projectedTitle.style.fontSize = ".6em";
    const projectedText = document.createElement("small");
    projectedText.innerText = roundToHundred(player.projectedScore).toString();

    row.appendChild(imageDiv);
    row.appendChild(nameDiv);
    row.appendChild(scoreDiv);

    imageDiv.appendChild(image);

    nameDiv.appendChild(boldName);
    nameDiv.appendChild(lineBreak);
    nameDiv.appendChild(teamParagraph);

    scoreDiv.appendChild(scoreTitle);
    scoreDiv.appendChild(scoreText);
    scoreDiv.appendChild(projectedTitle);
    scoreDiv.appendChild(projectedText);

    td.appendChild(row);
    return td;
}
