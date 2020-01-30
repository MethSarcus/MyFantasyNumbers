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
                enableModalLineupSwitcher(league, teamID, data.Week);
                generateMatchupTable(league, teamID, data.Week);
            });
            $("td", row).eq(1).css( "background-color",  getCardColor(week.getTeamScoreFinish(member.teamID), league.members.length));
            $("td", row).eq(2).css( "background-color",  getCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter((it: Matchup) => !it.byeWeek).length * 2));
            $("td", row).eq(3).css( "background-color",  getCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter((it: Matchup) => !it.byeWeek).length * 2));
            $(row).mouseenter(() => {
                $("td", row).eq(1).css( "background-color",  getDarkCardColor(week.getTeamScoreFinish(member.teamID), league.members.length));
                $("td", row).eq(2).css( "background-color",  getDarkCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter((it: Matchup) => !it.byeWeek).length * 2));
                $("td", row).eq(3).css( "background-color",  getDarkCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter((it: Matchup) => !it.byeWeek).length * 2));
            }).mouseleave(() => {
                $("td", row).eq(1).css( "background-color",  getCardColor(week.getTeamScoreFinish(member.teamID), league.members.length));
                $("td", row).eq(2).css( "background-color",  getCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter((it: Matchup) => !it.byeWeek).length * 2));
                $("td", row).eq(3).css( "background-color",  getCardColor(league.getMarginFinish(member.teamID, week.weekNumber), week.matchups.filter((it: Matchup) => !it.byeWeek).length * 2));
            });
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

// this function is to create vs populate
function createMemberWeekTable(league: League): void {
    const weekTable = document.getElementById("memberWeekTable");
    const tableBody = document.getElementById("member_week_table_body");
    for (let i = 1; i <= league.settings.seasonDuration.regularSeasonLength; i++) {
        const row = document.createElement("tr");
        const weekCell = document.createElement("td");
        const scoreCell = document.createElement("td");
        const vsCell = document.createElement("td");
        const marginCell = document.createElement("td");
        marginCell.id = "week_" + i + "_margin";
        weekCell.appendChild(document.createTextNode(i.toString()));
    }
}
