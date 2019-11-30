declare var ScrollHint: any;

function main() {
    localStorage.clear();
    const sleeperButton = document.getElementById("platform_input_0") as any;
    const espnButton = document.getElementById("platform_input_1") as any;
    const leagueIDInput = document.getElementById("league_id_input") as HTMLInputElement;
    const seasonIDSelector = document.getElementById("select_year_input") as HTMLSelectElement;

    const leagueID = leagueIDInput.value.replace(/\D/g, "");
    const seasonID = parseInt(seasonIDSelector.value.replace(/\D/g, ""), 10);
    if (leagueID !== undefined && seasonID !== undefined) {
        initCube();
        if (sleeperButton.checked) {
            getSleeperLeagueSettings(leagueID, seasonID);
        } else if (espnButton.checked) {
            if (localStorage.getItem(leagueID + seasonID)) {
                const jsonLeague = JSON.parse(localStorage.getItem(leagueID + seasonID));
                const restoredLeague = ESPNLeague.convertESPNFromJson(jsonLeague);
                restoredLeague.setPage();
            } else {
                localStorage.clear();
                getESPNSettings(leagueID, seasonID);
            }
        }
    }
}

function transitionToLeaguePage() {
    const particles = document.getElementById("particles-js");
    particles.style.display = "none";
    updateLoadingText("Finished");
    $("#prompt_screen").stop(true, true).fadeOut(200, () => {
        unfadeLeaguePage();
    });
}

function selectedPlatform(button: HTMLButtonElement): void {
    const seasonIDSelector = document.getElementById("select_year_input") as HTMLSelectElement;
    const children = seasonIDSelector.childNodes;
    if (button.value === "espn") {
        children.forEach((option) => {
            if ((option as HTMLSelectElement).value !== "2019") {
                (option as HTMLSelectElement).disabled = true;
            } else {
                (option as HTMLSelectElement).disabled = false;
                (option as HTMLSelectElement).setAttribute("checked", "checked");
                (option as HTMLSelectElement).setAttribute("selected", "true");
            }
        });
    } else {
        children.forEach((option) => {
            (option as HTMLSelectElement).disabled = false;
        });
    }
}

function enableButtons(): void {
    document.getElementById("league_name_header").onclick = () => {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
    document.getElementById("pwrRankButton").onclick = () => {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
}

function enableTradePage(): void {
    document.getElementById("trades_button").style.display = "block";
    document.getElementById("trades_button").onclick = () => {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
}

function enableSeasonPortionSelector(league: League): void {
    if (league.settings.currentMatchupPeriod > league.settings.regularSeasonLength) {
        document.getElementById(SEASON_PORTION.REGULAR).onclick = () => {
            league.seasonPortion = SEASON_PORTION.REGULAR;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (let i = 1; i <= league.members.length; i++) {
                if ($("#" + i).find("a.active").length !== 0) {
                    fadeTeam(league, parseInt(i.toString(), 10));
                }
            }
        };

        document.getElementById(SEASON_PORTION.POST).onclick = () => {
            league.seasonPortion = SEASON_PORTION.POST;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (let i = 1; i <= league.members.length; i++) {
                if ($("#" + i).find("a.active").length !== 0) {
                    fadeTeam(league, parseInt(i.toString(), 10));
                }
            }
        };

        document.getElementById(SEASON_PORTION.ALL).onclick = () => {
            league.seasonPortion = SEASON_PORTION.ALL;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (let i = 1; i <= league.members.length; i++) {
                if ($("#" + i).find("a.active").length !== 0) {
                    fadeTeam(league, parseInt(i.toString(), 10));
                }
            }
        };
    } else {
        document.getElementById(SEASON_PORTION.ALL).classList.add("disabled");
        document.getElementById(SEASON_PORTION.POST).classList.add("disabled");
        (document.getElementById("post_radio_button") as HTMLButtonElement).disabled = true;
        (document.getElementById("complete_radio_button") as HTMLButtonElement).disabled = true;
    }
}

function enableYearSelector(league: League): void {
    const yearSelector = document.getElementById("available_seasons");
    league.settings.yearsActive.forEach((year) => {
        const option = document.createElement("option");
        option.text = year.toString();
        option.value = year.toString();
        if (option.value === league.season.toString()) {
            option.selected = true;
        }
        (yearSelector as HTMLSelectElement).add(option);
    });
}

function enablePlugins(): void {
    $(() => {
        $('[data-toggle="tooltip"]').tooltip();
    });

    $("#league_stats_table tr").hover(function() {
        $(this).addClass("hover");
        deselectLeagueLineData($(this).find("td:first-child").text());
    }, function() {
        $(this).removeClass("hover");
        reselectLeagueLineData();
    });

    new ScrollHint("#league_trades_container", {
        suggestiveShadow: true
      });
}

function updateLeagueStatsCards(league: League): void {
    updateLeagueWeeklyAverage(league);
    updateLeagueStandardDeviation(league);
    updateLeagueEfficiency(league);
    updateBestWorstLeagueWeeks(league);

}

function updateLeagueStandardDeviation(league: League) {
    const leagueStandardDeviation = document.getElementById("league_standard_deviation");
    leagueStandardDeviation.innerText = roundToHundred(league.getLeagueStandardDeviation()).toString();
}

function updateLeagueEfficiency(league: League) {
    const leagueEfficiency = document.getElementById("league_efficiency_percentage");
    leagueEfficiency.innerText = roundToHundred(league.getAverageEfficiency()).toString();
}

function updateLeagueWeeklyAverage(league: League) {
    const leagueWeeklyAverage = document.getElementById("league_weekly_average");
    leagueWeeklyAverage.innerText = roundToHundred(league.getLeagueWeeklyAverage()).toString();
}

function updateBestWorstLeagueWeeks(league: League) {
    const leagueBestWeekScore = document.getElementById("league_best_week_score");
    const leagueBestWeekTeamName = document.getElementById("league_best_week_team_name");
    const leagueWorstWeekTeamName = document.getElementById("league_worst_week_team_name");
    const leagueBestWeekImage = document.getElementById("team_best_week_image") as HTMLImageElement;
    const leagueWorstWeekImage = document.getElementById("team_worst_week_image") as HTMLImageElement;
    const leagueWorstWeekScore = document.getElementById("league_worst_week_score");
    const leagueBestWeekNumber = document.getElementById("league_best_week_number");
    const leagueWorstWeekNumber = document.getElementById("league_worst_week_number");
    const bestWeek = league.getOverallBestWeek();
    const worstWeek = league.getOverallWorstWeek();

    leagueBestWeekScore.innerText = roundToHundred(bestWeek.getWinningTeam().score).toString() + " Points";
    leagueBestWeekTeamName.innerText = league.getMember(bestWeek.getWinningTeam().teamID).teamNameToString();
    leagueBestWeekNumber.innerText = "Week " + bestWeek.weekNumber.toString();
    leagueBestWeekImage.src = league.getMember(bestWeek.getWinningTeam().teamID).logoURL;

    leagueWorstWeekScore.innerText = roundToHundred(worstWeek.getLosingTeam().score).toString() + " Points";
    leagueWorstWeekTeamName.innerText = league.getMember(worstWeek.getLosingTeam().teamID).teamNameToString();
    leagueWorstWeekNumber.innerText = "Week " + worstWeek.weekNumber.toString();
    leagueWorstWeekImage.src = league.getMember(worstWeek.getLosingTeam().teamID).logoURL;
}

function createTeamMenu(league: League): void {
    const tabsList = document.getElementById("tabs-content");
    const nav = document.getElementById("team_dropdown");
    const q = document.getElementById("leaguePage");
    tabsList.appendChild(q);
    for (const i in league.members) {
        const a = document.createElement("li");
        a.id = league.members[i].teamID.toString();
        a.classList.add("nav-item", "align-items-left", "side-item", "justify-content-center");
        a.onclick = function() {
            $(".nav-link").removeClass("active");
            fadeTeamWithLogic(league, parseInt((this as any).id, 10));
        };
        const b = document.createElement("a");
        b.id = league.members[i].teamID + "_link";
        b.setAttribute("data-toggle", "pill");
        b.href = "#teamPill";
        b.classList.add("nav-link");
        b.style.paddingLeft = "3px;";
        const c = document.createElement("img");
        c.src = league.members[i].logoURL;
        c.style.width = "25px";
        c.style.height = "25px";
        c.style.borderRadius = "25px";
        c.addEventListener("error", fixNoImage);
        c.style.marginLeft = "8px";
        c.style.marginRight = "auto";
        b.appendChild(c);
        const d = document.createTextNode(" " + league.members[i].teamNameToString());
        b.appendChild(d);
        a.appendChild(b);
        nav.appendChild(a);
    }
}
