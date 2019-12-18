function generateMatchupTable(league: League, firstTeamId: number, weekNumber: number) {
    const tableBody = document.getElementById("matchup_modal_table_body");
    const matchup = league.getWeek(weekNumber).getTeamMatchup(firstTeamId);
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
    const scoreRow = document.createElement("tr");
    const teamScoreCell = document.createElement("td");
    const otherTeamScoreCell = document.createElement("td");
    const marginScoreCell = document.createElement("td");
    const teamScore = document.createElement("h5");
    const otherTeamScore = document.createElement("h5");
    const marginScore = document.createElement("h5");
    otherTeamScore.innerText = roundToHundred(matchup.away.score).toString();
    teamScore.innerText = roundToHundred(matchup.home.score).toString();
    if (!matchup.byeWeek) {
        marginScore.innerText = roundToHundred(matchup.home.score - matchup.away.score).toString();
    } else {
        marginScore.innerText = "0.00";
    }
    teamScoreCell.appendChild(teamScore);
    otherTeamScoreCell.appendChild(otherTeamScore);
    marginScoreCell.appendChild(marginScore);
    scoreRow.appendChild(teamScoreCell);
    scoreRow.appendChild(marginScoreCell);
    scoreRow.appendChild(otherTeamScoreCell);
    scoreRow.style.textAlign = "center";
    tableBody.appendChild(scoreRow);
    generateBenchTable(matchup);
}

function generateBenchTable(matchup: Matchup) {
    const tableBody = document.getElementById("matchup_modal_bench_table_body");
    tableBody.innerHTML = "";
    const size = Math.max(matchup.home.bench.length, matchup.away.bench.length);

    for (let i = 0; i < size; i++) {
        const row = document.createElement("tr");
        if (matchup.home.bench[i]) {
            row.appendChild(generateBenchPlayerCell(matchup.home.bench[i], true));
        } else {
            row.appendChild(generateBenchPlayerCell(new EmptySlot(88), true));
        }
        row.appendChild(document.createElement("td"));
        if (matchup.away.bench[i]) {
            row.appendChild(generateBenchPlayerCell(matchup.away.bench[i], false));
        } else {
            row.appendChild(generateBenchPlayerCell(new EmptySlot(88), false));
        }
        tableBody.appendChild(row);
    }
}

function generateMatchupPlayerRow(player: Player, otherPlayer: Player): HTMLTableRowElement {
    const tr = document.createElement("tr");
    const margin = player.score - otherPlayer.score;
    const playerBadgeCell = generatePositionBadge(margin, player.lineupSlotID);
    let firstPlayerCell;
    let otherPlayerCell;
    try {
        firstPlayerCell = generatePlayerRowCell(player, true);
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.log(error);
        // tslint:disable-next-line: no-console
        console.log(player);
    }

    try {
        otherPlayerCell = generatePlayerRowCell(otherPlayer, false);
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.log(error);
        // tslint:disable-next-line: no-console
        console.log(otherPlayer);
    }

    if (margin > 0) {
        firstPlayerCell.style.background = "linear-gradient(to left, #00ff00 0%, #ffffff 100%)";
        // firstPlayerCell.style.borderRightStyle = "solid";
        otherPlayerCell.style.background = "linear-gradient(to right, #ff0000 0%, #ffffff 100%)";
        // otherPlayerCell.style.borderLeftStyle = "solid";
    } else if (margin < 0) {
        otherPlayerCell.style.background = "linear-gradient(to right, #00ff00 0%, #ffffff 100%)";
        // otherPlayerCell.style.borderLeftStyle = "solid";
        firstPlayerCell.style.background = "linear-gradient(to left, #ff0000 0%, #ffffff 100%)";
        // firstPlayerCell.style.borderRightStyle = "solid";
    } else {
        // firstPlayerCell.style.borderRight = "green";
        // firstPlayerCell.style.borderRightStyle = "solid";
        // otherPlayerCell.style.borderLeft = "green";
        // otherPlayerCell.style.borderLeft = "solid";
    }
    tr.appendChild(firstPlayerCell);
    tr.appendChild(playerBadgeCell);
    tr.appendChild(otherPlayerCell);

    return tr;
}

function generateTeamPlayerRow(player: Player): HTMLTableRowElement {
    const tr = document.createElement("tr");
    const firstPlayerCell = generateBenchPlayerCell(player, true);
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
    margin.classList.add("margin_small_text");
    if (marginText > 0) {
        margin.innerText = "+" + roundToHundred(marginText).toString();
        margin.style.color = "#00ff00";
    } else {
        margin.innerText = roundToHundred(marginText).toString();
        margin.style.color = "#ff0000";
    }
    container.appendChild(posText);
    td.appendChild(container);
    td.appendChild(margin);

    return td;
}

function generateBenchPositionBadge(position: string) {
    const td = document.createElement("td");
    td.style.textAlign = "center";
    const container = document.createElement("div");
    container.style.backgroundColor = getMemberColor(positionToInt.get(position));
    container.style.color = "white";
    container.classList.add("bench_position_badge");
    const posText = document.createElement("b");
    posText.style.fontSize = "1em";
    posText.innerText = position;
    container.appendChild(posText);
    td.appendChild(container);

    return td;
}

function generatePlayerRowCell(player: Player, homePlayer: boolean): HTMLTableDataCellElement {
    const td = document.createElement("td");
    const row = document.createElement("div");
    row.classList.add("row");
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("col-3", "pt-3");
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
    nameDiv.classList.add("col-6", "pt-3");
    const boldName = document.createElement("b");
    const teamParagraph = document.createElement("p");
    boldName.innerText = player.firstName + " " + player.lastName;
    teamParagraph.innerText = player.position + " - " + getRealTeamInitials(player.realTeamID);
    const lineBreak = document.createElement("br");
    const scoreDiv = document.createElement("div");
    scoreDiv.classList.add("col-3");
    const scoreTitle = document.createElement("div");
    scoreTitle.innerText = "Score";
    scoreTitle.style.fontSize = ".8em";
    const scoreText = document.createElement("b");
    scoreText.innerText = roundToHundred(player.score).toString();
    const projectedTitle = document.createElement("div");
    projectedTitle.innerText = "Projected";
    projectedTitle.style.fontSize = ".6em";
    const projectedText = document.createElement("small");
    projectedText.innerText = roundToHundred(player.projectedScore).toString();

    if (homePlayer) {
        row.appendChild(imageDiv);
        row.appendChild(nameDiv);
        row.appendChild(scoreDiv);
        scoreDiv.style.textAlign = "right";
        nameDiv.style.textAlign = "left";
    } else {
        scoreDiv.style.textAlign = "left";
        nameDiv.style.textAlign = "right";
        row.appendChild(scoreDiv);
        row.appendChild(nameDiv);
        row.appendChild(imageDiv);
    }

    imageDiv.appendChild(image);

    nameDiv.appendChild(boldName);
    nameDiv.appendChild(lineBreak);
    nameDiv.appendChild(teamParagraph);
    nameDiv.classList.add("player_cell_name");

    scoreDiv.classList.add("player_cell_score");
    scoreDiv.appendChild(scoreTitle);
    scoreDiv.appendChild(scoreText);
    scoreDiv.appendChild(document.createElement("br"));
    scoreDiv.appendChild(projectedTitle);
    scoreDiv.appendChild(projectedText);
    td.appendChild(row);
    return td;
}

function generateBenchPlayerCell(player: Player, homePlayer: boolean) {
    const td = document.createElement("td");
    const row = document.createElement("div");
    const badge = generateBenchPositionBadge(player.position);
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
    const badgeDiv = document.createElement("div");
    badgeDiv.classList.add("col-3", "pt-3");
    badgeDiv.appendChild(badge);
    image.classList.add("player_badge_image", "my-auto");
    image.src = pictureURL;
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("col-4", "pt-3");
    const boldName = document.createElement("b");
    const teamParagraph = document.createElement("p");
    boldName.innerText = player.firstName + " " + player.lastName;
    teamParagraph.innerText = player.position + " - " + getRealTeamInitials(player.realTeamID);
    const lineBreak = document.createElement("br");
    const scoreDiv = document.createElement("div");
    scoreDiv.classList.add("col-3");
    const scoreTitle = document.createElement("div");
    scoreTitle.innerText = "Score";
    scoreTitle.style.fontSize = ".8em";
    const scoreText = document.createElement("b");
    scoreText.innerText = roundToHundred(player.score).toString();
    const projectedTitle = document.createElement("div");
    projectedTitle.innerText = "Projected";
    projectedTitle.style.fontSize = ".6em";
    const projectedText = document.createElement("small");
    projectedText.innerText = roundToHundred(player.projectedScore).toString();

    if (homePlayer) {
        row.appendChild(badgeDiv);
        row.appendChild(imageDiv);
        row.appendChild(nameDiv);
        row.appendChild(scoreDiv);
        scoreDiv.style.textAlign = "right";
    } else {
        scoreDiv.style.textAlign = "left";
        row.appendChild(scoreDiv);
        row.appendChild(nameDiv);
        row.appendChild(imageDiv);
        row.appendChild(badgeDiv);
    }
    imageDiv.appendChild(image);

    nameDiv.appendChild(boldName);
    nameDiv.appendChild(lineBreak);
    nameDiv.appendChild(teamParagraph);
    nameDiv.classList.add("player_cell_name");

    scoreDiv.classList.add("player_cell_score");
    scoreDiv.appendChild(scoreTitle);
    scoreDiv.appendChild(scoreText);
    scoreDiv.appendChild(document.createElement("br"));
    scoreDiv.appendChild(projectedTitle);
    scoreDiv.appendChild(projectedText);
    td.appendChild(row);
    return td;
}

function generateGenericPlayerCell(player: SleeperBasePlayer): HTMLTableDataCellElement {
    const td = document.createElement("td");
    const row = document.createElement("div");
    row.classList.add("row");
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("col-3", "pt-3");
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
    nameDiv.classList.add("col-6", "pt-3");
    const boldName = document.createElement("b");
    const teamParagraph = document.createElement("p");
    boldName.innerText = player.firstName + " " + player.lastName;
    teamParagraph.innerText = player.position + " - " + getRealTeamInitials(player.realTeamID);
    const lineBreak = document.createElement("br");
    row.appendChild(imageDiv);
    row.appendChild(nameDiv);
    nameDiv.style.textAlign = "left";
    imageDiv.appendChild(image);
    nameDiv.appendChild(boldName);
    nameDiv.appendChild(lineBreak);
    nameDiv.appendChild(teamParagraph);
    nameDiv.classList.add("player_cell_name");
    td.appendChild(row);
    return td;
}

function updateMainPageLeagueStatCards(league: League): void {
    document.getElementById("league_weekly_average").innerText = roundToHundred(league.getLeagueWeeklyAverage()).toString();
    document.getElementById("league_standard_deviation").innerText = roundToHundred(league.getLeagueStandardDeviation()).toString();
    document.getElementById("league_weekly_average_pp").innerText = roundToHundred(league.getLeaguePP() / league.getSeasonPortionWeeks().length).toString();
    updateLeagueEfficiency(league);
}
