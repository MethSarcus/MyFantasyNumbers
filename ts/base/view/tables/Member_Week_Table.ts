function initMemberWeekTable(league: League) {
    $("#memberWeekTable").DataTable({
        paging: false,
        searching: false,
        orderClasses: true,
        order: [[0, "asc"]],
        columns: [
            { data: "Week"},
            {
                data: "Score",
            },
            {
                data: "VS",
            },
            {
                data: "Margin",
            },
        ],
        createdRow( row: any, data: any, index: any ) {
            const curTeamId = document.getElementById("teamPill").getAttribute("currentteam");
            const member = league.getMember(parseInt(curTeamId));
            const week = league.getWeek(data.Week);
            $(row).attr("data-toggle", "modal");
            $(row).attr("data-target", "#matchup_modal");
            $(row).click(() => {
                const teamID = parseInt(document.getElementById("teamPill").getAttribute("currentteam"));
                generateMatchupTable(league, teamID, data.Week);
            });
            $("td", row).eq(1).css( "background-color",  getCardColor(week.getTeamScoreFinish(member.teamID), league.members.length));
            $("td", row).eq(2).css( "background-color",  getCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter((it: Matchup) => !it.byeWeek).length * 2));
            $("td", row).eq(3).css( "background-color",  getCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter((it: Matchup) => !it.byeWeek).length * 2));
        },
    });
}

function updateMemberWeekTable(league: League, member: Member) {
    const table = $("#memberWeekTable").DataTable();
    table.clear();
    league.getSeasonPortionWeeks().forEach((week) => {
        table.row.add(getMemberWeekTableData(league, week, member.teamID));
    });
    table.draw();
}

function getMemberWeekTableData(league: League, week: Week, teamID: number) {
    const curMatchup = week.getTeamMatchup(teamID);
    const team = week.getTeam(teamID);
    if (!curMatchup.byeWeek) {
        return {
            Week: week.weekNumber,
            Score: roundToHundred(team.score),
            VS: league.getMember(curMatchup.getOpponent(teamID).teamID).teamAbbrev,
            Margin: roundToHundred(team.score - curMatchup.getOpponent(teamID).score),
        };
    } else {
        return {
            Week: week.weekNumber,
            Score: roundToHundred(team.score),
            VS: "Bye",
            Margin: "N/A",
        };
    }
}

function updateMemberWeekTableHTML(league: League, member: Member): void {
    $("#member_week_table_body").empty();
    const weekTable = document.getElementById("memberWeekTable");
    const tableBody = document.getElementById("member_week_table_body");
    league.weeks.forEach((week) => {
        const scoreColor = getLightCardColor(week.getTeamScoreFinish(member.teamID), league.members.length);
        const curMatchup = week.getTeamMatchup(member.teamID);
        const curTeam = week.getTeam(member.teamID);
        const row = document.createElement("tr");
        const weekCell = document.createElement("td");
        const scoreCell = document.createElement("td");
        const vsCell = document.createElement("td");
        const marginCell = document.createElement("td");
        weekCell.appendChild(document.createTextNode(week.weekNumber.toString()));
        scoreCell.appendChild(document.createTextNode(roundToHundred(curTeam.score).toString()));
        scoreCell.style.background = scoreColor;
        weekCell.style.background = scoreColor;
        vsCell.style.background = scoreColor;
        if (!curMatchup.byeWeek) {
            vsCell.appendChild(document.createTextNode(league.getMember(curMatchup.getOpponent(member.teamID).teamID).teamAbbrev));
            marginCell.appendChild(document.createTextNode(roundToHundred(curTeam.score - curMatchup.getOpponent(member.teamID).score).toString()));
        } else {
            vsCell.appendChild(document.createTextNode("N/A"));
            marginCell.appendChild(document.createTextNode("N/A"));
        }
        if (!curMatchup.byeWeek) {
            marginCell.style.background = getLightCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter((it) => !it.byeWeek).length * 2);
        }
        row.appendChild(weekCell);
        row.appendChild(scoreCell);
        row.appendChild(vsCell);
        row.appendChild(marginCell);
        row.setAttribute("data-toggle", "modal");
        row.setAttribute("data-target", "#matchup_modal");
        row.addEventListener("click", function() {
            createMatchupModal(this, league);
        });
        tableBody.appendChild(row);
    });
    weekTable.appendChild(tableBody);
}

function createMatchupModal(elem: HTMLTableRowElement, league: League): void {
    const weekNum = parseInt((elem.firstChild as HTMLTableCellElement).innerText);
    const teamID = parseInt(document.getElementById("teamPill").getAttribute("currentTeam"));

    generateMatchupTable(league, teamID, weekNum);
}

// this function is to create vs populate
function createMemberWeekTable(league: League): void {
    const weekTable = document.getElementById("memberWeekTable");
    const tableBody = document.getElementById("member_week_table_body");
    for (let i = 1; i <= league.settings.regularSeasonLength; i++) {
        const row = document.createElement("tr");
        const weekCell = document.createElement("td");
        const scoreCell = document.createElement("td");
        const vsCell = document.createElement("td");
        const marginCell = document.createElement("td");
        marginCell.id = "week_" + i + "_margin";
        weekCell.appendChild(document.createTextNode(i.toString()));
    }
}
