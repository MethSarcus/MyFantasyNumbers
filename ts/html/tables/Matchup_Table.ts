function generateMatchupTable(league: League, firstTeamId: number, weekNumber: number) {
    $("#matchup_modal_lineup_body").empty();
    const matchup = league.getWeek(weekNumber).getTeamMatchup(firstTeamId);
    const tableTitle = document.getElementById("matchup_modal_title");
    if (matchup.isPlayoffs) {
        tableTitle.innerText = "Week " + weekNumber.toString() + ", Playoffs";
    } else if (matchup.byeWeek) {
        tableTitle.innerText = "Week " + weekNumber.toString() + ", Bye Week";
    } else {
        tableTitle.innerText = "Week " + weekNumber.toString() + ", Regular Season";
    }
    document.getElementById("matchup_modal_first_team_name").innerText = league.getMember(matchup.home.teamID).teamNameToString();
    if (!matchup.byeWeek) {
        document.getElementById("matchup_modal_second_team_name").innerText = league.getMember(matchup.away.teamID).teamNameToString();
    }
    const lineups = getLineups(league, matchup);
    const homeLineup = lineups[0];
    const homeBench = lineups[1];
    const awayLineup = lineups[2];
    const awayBench = lineups[3];
    generateModalScore(homeLineup, awayLineup, matchup.byeWeek);
    generateLineupTable(homeLineup, awayLineup, league, matchup.byeWeek);
    generateBenchTable(homeBench, awayBench);
}

function getLineups(league: League, matchup: Matchup) {
    const lineups = [];
    if (document.getElementById("modal-home-lineup").classList.contains("active")) {
        lineups.push(matchup.home.lineup);
        lineups.push(matchup.home.bench);
    } else if (document.getElementById("modal-home-optimal-lineup").classList.contains("active")) {
        const optimalLineup = getOptimalLineup(league.settings.positionInfo.activeLineupSlots, matchup.home.getAllPlayers(), league.settings.positionInfo.excludedLineupSlots, league.settings.positionInfo.excludedPositions);
        const optimalLineupBench = matchup.home.getAllPlayers().filter((player) => {
            return !optimalLineup.includes(player);
        });
        lineups.push(optimalLineup);
        lineups.push(optimalLineupBench);
    } else if (document.getElementById("modal-home-opslap").classList.contains("active")) {
        const projectedOptimalLineup = getOptimalProjectedLineup(league.settings.positionInfo.activeLineupSlots, matchup.home.getAllPlayers(), league.settings.positionInfo.excludedLineupSlots, league.settings.positionInfo.excludedPositions);
        const projectedOptimalLineupBench = matchup.home.getAllPlayers().filter((player) => {
            return !projectedOptimalLineup.includes(player);
        });
        lineups.push(projectedOptimalLineup);
        lineups.push(projectedOptimalLineupBench);
    }

    if (document.getElementById("modal-away-lineup").classList.contains("active")) {
        lineups.push(matchup.away.lineup);
        lineups.push(matchup.away.bench);
    } else if (document.getElementById("modal-away-optimal-lineup").classList.contains("active")) {
        const optimalAwayLineup = getOptimalLineup(league.settings.positionInfo.activeLineupSlots, matchup.away.getAllPlayers(), league.settings.positionInfo.excludedLineupSlots, league.settings.positionInfo.excludedPositions);
        const optimalAwayLineupBench = matchup.away.getAllPlayers().filter((player) => {
            return !optimalAwayLineup.includes(player);
        });
        lineups.push(optimalAwayLineup);
        lineups.push(optimalAwayLineupBench);
    } else if (document.getElementById("modal-away-opslap").classList.contains("active")) {
        const projectedOptimalAwayLineup = getOptimalProjectedLineup(league.settings.positionInfo.activeLineupSlots, matchup.away.getAllPlayers(), league.settings.positionInfo.excludedLineupSlots, league.settings.positionInfo.excludedPositions);
        const projectedOptimalAwayLineupBench = matchup.away.getAllPlayers().filter((player) => {
            return !projectedOptimalAwayLineup.includes(player);
        });
        lineups.push(projectedOptimalAwayLineup);
        lineups.push(projectedOptimalAwayLineupBench);
    }

    return lineups;
}

function generateModalScore(homeLineup: Player[], awayLineup: Player[], isBye: boolean): void {
    let homeScore = 0;
    let awayScore = 0;

    homeLineup.forEach((player) => {
        homeScore += player.score;
    });
    awayLineup.forEach((player) => {
        awayScore += player.score;
    });
    homeScore = roundToHundred(homeScore);
    awayScore = roundToHundred(awayScore);
    const tableBody = document.getElementById("matchup_modal_lineup_body");
    const scoreRow = document.createElement("tr");
    const teamScoreCell = document.createElement("td");
    const otherTeamScoreCell = document.createElement("td");
    const marginScoreCell = document.createElement("td");
    const teamScore = document.createElement("h5");
    const otherTeamScore = document.createElement("h5");
    teamScore.style.textAlign = "right;";
    otherTeamScore.style.textAlign = "left;";
    const marginScore = document.createElement("b");
    otherTeamScore.innerText = roundToHundred(awayScore).toString() + " Points";
    teamScore.innerText = roundToHundred(homeScore).toString() + " Points";
    if (!isBye) {
        marginScore.innerText = roundToHundred(homeScore - awayScore).toString();
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
}

function generateLineupTable(homeLineup: Player[], awayLineup: Player[], league: League, isBye: boolean): void {
    const tableBody = document.getElementById("matchup_modal_lineup_body");
    let index = 0;
    league.settings.positionInfo.activeLineupSlots.forEach((slot) => {
        const slotId = slot[0];
        const slotAmount = slot[1];
        for (let i = 0; i < slotAmount; i++) {
            const firstPlayer = homeLineup[index];
            let secondPlayer;
            if (!isBye) {
                secondPlayer = awayLineup[index];
            } else {
                secondPlayer = new EmptySlot(slotId);
            }
            tableBody.appendChild(generateMatchupPlayerRow(firstPlayer, secondPlayer, slotId));
            index += 1;
        }
    });
}

function generateBenchTable(homeBench: Player[], awayBench: Player[]) {
    const tableBody = document.getElementById("matchup_modal_bench_table_body");
    $("#matchup_modal_bench_table_body").empty();
    const size = Math.max(homeBench.length, awayBench.length);

    for (let i = 0; i < size; i++) {
        const row = document.createElement("tr");
        if (homeBench[i]) {
            row.appendChild(generateBenchPlayerCell(homeBench[i], true, 20));
        } else {
            row.appendChild(generateBenchPlayerCell(new EmptySlot(88), true, 20));
        }
        row.appendChild(document.createElement("td"));
        if (awayBench[i]) {
            row.appendChild(generateBenchPlayerCell(awayBench[i], false, 20));
        } else {
            row.appendChild(generateBenchPlayerCell(new EmptySlot(88), false, 20));
        }
        tableBody.appendChild(row);
    }
}

function enableModalLineupSwitcher(league: League, firstTeamId: number, weekNumber: number): void {
    const homeList = [document.getElementById("modal-home-lineup"),
    document.getElementById("modal-home-optimal-lineup"),
    document.getElementById("modal-home-opslap")];
    homeList.forEach((button: HTMLLabelElement) => {
        button.onclick = () => {
            homeList.forEach((innerButton: HTMLLabelElement) => {innerButton.classList.remove("active"); innerButton.children[0].classList.remove("active"); });
            button.children[0].classList.add("active");
            button.classList.add("active");
            generateMatchupTable(league, firstTeamId, weekNumber);
        };
    });

    const awayList = [document.getElementById("modal-away-lineup"),
    document.getElementById("modal-away-optimal-lineup"),
    document.getElementById("modal-away-opslap")];
    awayList.forEach((button: HTMLLabelElement) => {
        button.onclick = () => {
            awayList.forEach((innerButton: HTMLLabelElement) => {innerButton.classList.remove("active"); innerButton.children[0].classList.remove("active"); });
            button.children[0].classList.add("active");
            button.classList.add("active");
            generateMatchupTable(league, firstTeamId, weekNumber);
        };
    });
}

function generateMatchupPlayerRow(player: Player, otherPlayer: Player, slot: number): HTMLTableRowElement {
    const tr = document.createElement("tr");
    const margin = player.score - otherPlayer.score;
    const playerBadgeCell = generatePositionBadge(margin, slot);
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
    const firstPlayerCell = generateBenchPlayerCell(player, true, 20);
    tr.appendChild(firstPlayerCell);
    return tr;
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

function generateBenchPlayerCell(player: Player, homePlayer: boolean, slot: number) {
    const td = document.createElement("td");
    const row = document.createElement("div");
    const badge = generateBenchPositionBadge(slot);
    row.classList.add("row");
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("col-2", "pt-3");
    const image = document.createElement("img");
    let pictureURL = "./assets/images/user1.png";
    if (player.position === "D/ST" || player.position === "DEF") {
        pictureURL = "https://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(player.realTeamID) + ".png&h=150&w=150";
    } else if (player.espnID !== "-1") {
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
