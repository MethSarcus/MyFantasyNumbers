function main() {
    var sleeperButton = document.getElementById("platform_input_0");
    var espnButton = document.getElementById("platform_input_1");
    var leagueIDInput = document.getElementById("league_id_input");
    var seasonIDSelector = document.getElementById("select_year_input");
    var leagueID = leagueIDInput.value.replace(/\D/g, "");
    var seasonID = parseInt(seasonIDSelector.value.replace(/\D/g, ""), 10);
    if (leagueID !== undefined && seasonID !== undefined) {
        initCube();
        if (sleeperButton.checked) {
            getSleeperLeagueSettings(leagueID, seasonID);
        }
        else if (espnButton.checked) {
            if (localStorage.getItem(leagueID + seasonID)) {
                var jsonLeague = JSON.parse(localStorage.getItem(leagueID + seasonID));
                var restoredLeague = League.convertESPNFromJson(jsonLeague);
                setPage(restoredLeague);
            }
            else {
                localStorage.clear();
                getESPNSettings(leagueID, seasonID);
            }
        }
    }
}
function setPage(league) {
    console.log(league);
    document.getElementById("league_name_header").innerHTML = league.leagueName;
    document.getElementById("league_name_header").onclick = function () {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
    document.getElementById("pwrRankButton").onclick = function () {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
    localStorage.setItem(league.id + "" + league.id, JSON.stringify(league));
    var profileImage = document.getElementById("team_image");
    profileImage.addEventListener("error", fixNoImage);
    if (league.settings.currentMatchupPeriod > league.settings.regularSeasonLength) {
        document.getElementById(SEASON_PORTION.REGULAR).onclick = function () {
            league.seasonPortion = SEASON_PORTION.REGULAR;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($("#" + i).find("a.active").length !== 0) {
                    fadeTeam(league, parseInt(i.toString(), 10));
                }
            }
        };
        document.getElementById(SEASON_PORTION.POST).onclick = function () {
            league.seasonPortion = SEASON_PORTION.POST;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($("#" + i).find("a.active").length !== 0) {
                    fadeTeam(league, parseInt(i.toString(), 10));
                }
            }
        };
        document.getElementById(SEASON_PORTION.ALL).onclick = function () {
            league.seasonPortion = SEASON_PORTION.ALL;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($("#" + i).find("a.active").length !== 0) {
                    fadeTeam(league, parseInt(i.toString(), 10));
                }
            }
        };
    }
    else {
        document.getElementById(SEASON_PORTION.ALL).classList.add("disabled");
        document.getElementById(SEASON_PORTION.POST).classList.add("disabled");
        document.getElementById("post_radio_button").disabled = true;
        document.getElementById("complete_radio_button").disabled = true;
    }
    var yearSelector = document.getElementById("available_seasons");
    league.settings.yearsActive.forEach(function (year) {
        var option = document.createElement("option");
        option.text = year.toString();
        option.value = year.toString();
        if (option.value === league.season.toString()) {
            option.selected = true;
        }
        yearSelector.add(option);
    });
    var nav = document.getElementById("team_dropdown");
    var tabsList = document.getElementById("tabs-content");
    for (var i in league.members) {
        var a = document.createElement("li");
        a.id = league.members[i].teamID.toString();
        a.classList.add("nav-item", "align-items-left", "side-item", "justify-content-center");
        a.onclick = function () {
            $(".nav-link").removeClass("active");
            fadeTeamWithLogic(league, parseInt(this.id, 10));
        };
        var b = document.createElement("a");
        b.id = league.members[i].teamID + "_link";
        b.setAttribute("data-toggle", "pill");
        b.href = "#teamPill";
        b.classList.add("nav-link");
        b.style.paddingLeft = "3px;";
        var c = document.createElement("img");
        c.src = league.members[i].logoURL;
        c.style.width = "25px";
        c.style.height = "25px";
        c.style.borderRadius = "25px";
        c.addEventListener("error", fixNoImage);
        c.style.marginLeft = "8px";
        c.style.marginRight = "auto";
        b.appendChild(c);
        var d = document.createTextNode(" " + league.members[i].nameToString());
        b.appendChild(d);
        a.appendChild(b);
        nav.appendChild(a);
    }
    var q = document.getElementById("leaguePage");
    tabsList.appendChild(q);
    createPowerRankTable(league);
    var graphPage = document.getElementById("graphPage");
    var selectRow = document.createElement("div");
    selectRow.classList.add("row", "mb-4");
    var pieButton = document.createElement("button");
    pieButton.classList.add("col-2", "btn", "btn-outline-info", "mx-auto");
    var barButton = document.createElement("button");
    var lineButton = document.createElement("button");
    var tradeButton = document.createElement("button");
    var graphRow = document.createElement("div");
    graphRow.classList.add("row");
    var graphContainer = document.createElement("div");
    graphContainer.classList.add("col-12", "col-sm-12", "col-md-9", "col-lg-9", "col-xl-9", "graphContainer");
    var stackedCanvas = document.createElement("canvas");
    stackedCanvas.id = "GRAPHCANVAS";
    graphContainer.appendChild(stackedCanvas);
    selectRow.appendChild(barButton);
    selectRow.appendChild(pieButton);
    selectRow.appendChild(lineButton);
    selectRow.appendChild(tradeButton);
    graphPage.appendChild(selectRow);
    graphRow.appendChild(graphContainer);
    graphPage.appendChild(graphRow);
    tabsList.appendChild(graphPage);
    createLeagueWeeklyLineChart(league, true);
    createLeagueStatsTable(league);
    createLeagueStackedGraph(league);
    initLeagueStatsTable();
    initPowerRankTable();
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    $("#league_stats_table tr").hover(function () {
        $(this).addClass("hover");
        deselectLeagueLineData($(this).find("td:first-child").text());
    }, function () {
        $(this).removeClass("hover");
        reselectLeagueLineData();
    });
    var particles = document.getElementById("particles-js");
    particles.style.display = "none";
    updateLoadingText("Finished");
    transitionToLeaguePage();
}
function transitionToLeaguePage() {
    $("#prompt_screen").stop(true, true).fadeOut(200, function () {
        unfadeLeaguePage();
    });
}
function selectedPlatform(button) {
    var seasonIDSelector = document.getElementById("select_year_input");
    var children = seasonIDSelector.childNodes;
    if (button.value === "espn") {
        children.forEach(function (option) {
            if (option.value !== "2019") {
                option.disabled = true;
            }
            else {
                option.disabled = false;
                option.setAttribute("checked", "checked");
                option.setAttribute("selected", "true");
            }
        });
    }
    else {
        children.forEach(function (option) {
            option.disabled = false;
        });
    }
}
//# sourceMappingURL=page_init.js.map