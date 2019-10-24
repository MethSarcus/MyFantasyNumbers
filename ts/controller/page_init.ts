function main() {
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
                const restoredLeague = League.convertESPNFromJson(jsonLeague);
                setPage(restoredLeague);
            } else {
                localStorage.clear();
                getESPNSettings(leagueID, seasonID);
            }
        }
    }
}

function setPage(league: League) {
    // tslint:disable-next-line: no-console
    console.log(league);
    document.getElementById("league_name_header").innerHTML = league.leagueName;
    document.getElementById("league_name_header").onclick = () => {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
    document.getElementById("pwrRankButton").onclick = () => {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
    localStorage.setItem(league.id + "" + league.id, JSON.stringify(league));
    const profileImage = document.getElementById("team_image");
    profileImage.addEventListener("error", fixNoImage);
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

    const nav = document.getElementById("team_dropdown");
    const tabsList = document.getElementById("tabs-content");

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
        const d = document.createTextNode(" " + league.members[i].nameToString());
        b.appendChild(d);
        a.appendChild(b);
        nav.appendChild(a);
    }

    const q = document.getElementById("leaguePage");
    tabsList.appendChild(q);
    createPowerRankTable(league);

    const graphPage = document.getElementById("graphPage");
    const selectRow = document.createElement("div");
    selectRow.classList.add("row", "mb-4");

    const pieButton = document.createElement("button");
    pieButton.classList.add("col-2", "btn", "btn-outline-info", "mx-auto");
    const barButton = document.createElement("button");
    const lineButton = document.createElement("button");
    const tradeButton = document.createElement("button");
    const graphRow = document.createElement("div");
    graphRow.classList.add("row");

    const graphContainer = document.createElement("div");
    graphContainer.classList.add("col-12", "col-sm-12", "col-md-9", "col-lg-9", "col-xl-9", "graphContainer");
    const stackedCanvas = document.createElement("canvas");
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
    createLeagueWeeklyLineChart(league);
    createLeagueStatsTable(league);
    createLeagueStackedGraph(league);
    $("#league_stats_table").DataTable({
        paging: false,
        searching: false,
        // render(data, type, row) {
        //     console.log(data);
        //     console.log(type);
        //     console.log(row);
        //     // if (type === "display" && row) {
        //     //     data = "$" + data.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + " " + "USD";
        //     // }
        //     return data;
        // },
    });
    $("#power_rank_table").DataTable({
        paging: false,
        searching: false,
        columns: [
            {data: "Team"},
            {data: "Actual Rank",
            render(data, type, row) {
                if (type === "display") {
                    data = ordinal_suffix_of(data);
                }
                return data;
              }},
            {data: "Power Rank",
            render(data, type, row) {
                if (type === "display") {
                    data = ordinal_suffix_of(data);
                }
                return data;
              }},
            {data: "Difference",
            render(data, type, row) {
                if (type === "display" && parseInt(data, 10) > 0) {
                    data = "+" + data;
                }
                return data;
              }},
            {data: "Power Record",
            sort(x, y) {
                const xWins = parseInt(x.split("-")[0], 10);
                const xLosses = parseInt(x.split("-")[1], 10);
                const yWins = parseInt(y.split("-")[0], 10);
                const yLosses = parseInt(x.split("-")[1], 10);

                if ( xWins > yWins) {
                    return 1;
                } else if ( xWins > yWins ) {
                    return -1;
                } else {
                    if (xLosses < yLosses) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
              }},
            {data: "Potential Record",
            sort(x, y) {
                const xWins = parseInt(x.split("-")[0], 10);
                const xLosses = parseInt(x.split("-")[1], 10);
                const yWins = parseInt(y.split("-")[0], 10);
                const yLosses = parseInt(x.split("-")[1], 10);

                if ( xWins > yWins) {
                    return 1;
                } else if ( xWins > yWins ) {
                    return -1;
                } else {
                    if (xLosses < yLosses) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
              }},
            {data: "Power Win %"},
            {data: "Potential Win %"},
        ],
        // render(data, type, row) {
        //     console.log(data);
        //     console.log(type);
        //     console.log(row);
        //     // if (type === "display" && row) {
        //     //     data = "$" + data.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + " " + "USD";
        //     // }
        //     return data;
        // },
    });
    $(() => {
        $('[data-toggle="tooltip"]').tooltip();
    });

    const particles = document.getElementById("particles-js");
    particles.style.display = "none";
    updateLoadingText("Finished");
    transitionToLeaguePage();
}

function transitionToLeaguePage() {
    $("#prompt_screen").stop(true, true).fadeOut(200, () => {
        unfadeLeaguePage();
    });
}

function selectedPlatform(button): void {
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
