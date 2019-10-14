function setPage(league: League) {
    document.getElementById("league_name_header").innerHTML = league.leagueName;
    document.getElementById("league_name_header").onclick = function () {
        $(".nav-link").removeClass('active');
        fadeToLeaguePage();
    };
    document.getElementById("pwrRankButton").onclick = function () {
        $(".nav-link").removeClass('active');
        fadeToLeaguePage();
    };
    localStorage.setItem(league.id + "" + league.id, JSON.stringify(league));
    console.log(league);
    const profileImage = document.getElementById('team_image');
    profileImage.addEventListener("error", fixNoImage);
    console.log("Running setpage");
    
    if (league.settings.currentMatchupPeriod > league.settings.regularSeasonLength) {
        document.getElementById(SEASON_PORTION.REGULAR).onclick = function () {
            league.seasonPortion = SEASON_PORTION.REGULAR;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($('#' + i).find('a.active').length !== 0) {
                    fadeTeam(league, i);
                }
            }
        };

        document.getElementById(SEASON_PORTION.POST).onclick = function () {
            league.seasonPortion = SEASON_PORTION.POST;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($('#' + i).find('a.active').length !== 0) {
                    fadeTeam(league, i);
                }
            }
        };

        document.getElementById(SEASON_PORTION.ALL).onclick = function () {
            league.seasonPortion = SEASON_PORTION.ALL;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($('#' + i).find('a.active').length !== 0) {
                    fadeTeam(league, i);
                }
            }
        };
    } else {
        document.getElementById(SEASON_PORTION.ALL).classList.add('disabled');
        document.getElementById(SEASON_PORTION.POST).classList.add('disabled');
        (document.getElementById("post_radio_button") as HTMLButtonElement).disabled = true;
        (document.getElementById("complete_radio_button") as HTMLButtonElement).disabled = true;
    }

    var yearSelector = document.getElementById("available_seasons");
    league.settings.yearsActive.forEach(year => {
        var option = document.createElement("option");
        option.text = year.toString();
        option.value = year.toString();
        if (option.value == league.season.toString()) {
            option.selected = true;
        }
        (yearSelector as HTMLSelectElement).add(option);
    });

    var nav = document.getElementById("sideNav");
    var tabsList = document.getElementById('tabs-content');

    //adds teams to sidebar
    for (var i in league.members) {
        let a = document.createElement("li");
        a.id = league.members[i].teamID.toString();
        a.classList.add("nav-item", 'align-items-left', 'side-item', "justify-content-center");
        a.onclick = function () {
            $(".nav-link").removeClass('active');
            fadeTeamWithLogic(league, (this as any).id);
            //updateTeamPill(league, this.id);
        };
        let b = document.createElement("a");
        b.id = league.members[i].teamID + "_link";
        b.setAttribute('data-toggle', 'pill');
        b.href = "#teamPill";
        b.classList.add('nav-link');
        b.style.paddingLeft = "3px;"
        let c = document.createElement('img');
        c.src = league.members[i].logoURL;
        c.style.width = "25px";
        c.style.height = "25px";
        c.style.borderRadius = "25px";
        c.addEventListener("error", fixNoImage);
        c.style.marginLeft = "8px";
        c.style.marginRight = "auto";
        b.appendChild(c);
        //b.appendChild(document.createElement('br'));
        let d = document.createTextNode(" " + league.members[i].nameToString());
        b.appendChild(d);
        a.appendChild(b);
        nav.appendChild(a);
    }

    //make league main page
    var q = document.getElementById("leaguePage");
    tabsList.appendChild(q); //adds main league page
    createPowerRankTable(league);

    //create graph page
    var graphPage = document.getElementById("graphPage");
    //graphpage contents
    var selectRow = document.createElement('div');
    selectRow.classList.add('row', 'mb-4');

    var pieButton = document.createElement('button');
    pieButton.classList.add('col-2', 'btn', 'btn-outline-info', 'mx-auto');
    var barButton = document.createElement('button');
    var lineButton = document.createElement('button');
    var tradeButton = document.createElement('button');
    var graphRow = document.createElement('div');
    graphRow.classList.add('row');

    var graphContainer = document.createElement('div');
    graphContainer.classList.add('col-12', 'col-sm-12', 'col-md-9', 'col-lg-9', 'col-xl-9', 'graphContainer');
    var stackedCanvas = document.createElement('canvas');
    stackedCanvas.id = "GRAPHCANVAS";
    graphContainer.appendChild(stackedCanvas);

    selectRow.appendChild(barButton);
    selectRow.appendChild(pieButton);
    selectRow.appendChild(lineButton);
    selectRow.appendChild(tradeButton);
    graphPage.appendChild(selectRow);
    graphRow.appendChild(graphContainer);
    //graphRow.appendChild(graphOptions);

    graphPage.appendChild(graphRow);

    tabsList.appendChild(graphPage);
    createLeagueWeeklyLineChart(league);
    createLeagueStatsTable(league);
    createLeagueStackedGraph(league);
    $('#league_stats_table').DataTable({
        paging: false,
        searching: false,
        //stripeClasses: true,
        // responsive: true
    });
    $('#power_rank_table').DataTable({
        paging: false,
        searching: false,
        //stripeClasses: true,
        // responsive: true
    });
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    //console.log(getSleeperWeekStats(4));
    // makeRequest('https://api.sleeper.app/v1/league/383472092907233280')
	// .then(function (posts) {
	// 	console.log('Success!', posts);
	// })
	// .catch(function (error) {
	// 	console.log('Something went wrong', error);
	// });
}
