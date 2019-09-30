function setPage(league) {
    document.getElementById("my-navbar-brand").innerHTML = league.leagueName;
    document.getElementById("my-navbar-brand").onclick = function () {
        $(".nav-link").removeClass('active');
        fadeToLeaguePage();
    };
    localStorage.setItem(league.leagueID + "" + league.seasonID, JSON.stringify(league));
    console.log(league);
    profileImage = document.getElementById('team_image');
    profileImage.addEventListener("error", fixNoImage);
    console.log("Running setpage");
    
    if (league.settings.currentMatchupPeriod > league.settings.regularSeasonLength) {
        document.getElementById(SEASON_PORTION.REGULAR).onclick = function () {
            league.seasonPortion = SEASON_PORTION.REGULAR;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($('#' + i).find('a.active').length !== 0) {
                    fadeTeam(document.getElementById('teamPill'), league, i);
                } else {
    
                }
            }
        };

        document.getElementById(SEASON_PORTION.POST).onclick = function () {
            league.seasonPortion = SEASON_PORTION.POST;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($('#' + i).find('a.active').length !== 0) {
                    fadeTeam(document.getElementById('teamPill'), league, i);
                } else {

                }
            }
        };

        document.getElementById(SEASON_PORTION.ALL).onclick = function () {
            league.seasonPortion = SEASON_PORTION.ALL;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (var i = 1; i <= league.members.length; i++) {
                if ($('#' + i).find('a.active').length !== 0) {
                    fadeTeam(document.getElementById('teamPill'), league, i);
                } else {

                }
            }
        };
    } else {
        document.getElementById(SEASON_PORTION.ALL).classList.add('disabled');
        document.getElementById(SEASON_PORTION.POST).classList.add('disabled');
        document.getElementById("post_radio_button").disabled = true;
        document.getElementById("complete_radio_button").disabled = true;
    }

    var yearSelector = document.getElementById("available_seasons");
    league.settings.yearsActive.forEach(year => {
        var option = document.createElement("option");
        option.text = year;
        option.value = year;
        if (option == league.season) {
            option.selected = true;
        }
        yearSelector.add(option);
    });

    var l = new Color("#FF0000");
    var r = new Color("#00FF00");
    var nav = document.getElementById("sideNav");
    var tabsList = document.getElementById('tabs-content');

    //adds teams to sidebar
    for (i in league.members) {
        let a = document.createElement("li");
        a.id = league.members[i].teamID;
        a.classList.add("nav-item", 'align-items-left', 'side-item', "justify-content-center");
        a.onclick = function () {
            $(".nav-link").removeClass('active');
            fadeTeam(document.getElementById('teamPill'), league, this.id);
            //updateTeamPill(league, this.id);
        };
        let b = document.createElement("a");
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
        let d = document.createTextNode(" " + league.members[i].teamLocation + " " + league.members[i].teamNickname);
        b.appendChild(d);
        a.appendChild(b);
        nav.appendChild(a);
    }

    //make league main page
    q = document.getElementById("leaguePage");
    tabsList.appendChild(q); //adds main league page
    //q.classList.add("tab-pane", "fade", "active", "show");
    // var cardRow = document.createElement('div');
    // cardRow.classList.add('row');
    // cardRow.appendChild(makeLeagueStatCards('League Average', league.getLeagueWeeklyAverage(), league.getLeagueStandardDeviation()));
    // let topMatchup = league.getOverallBestWeek();
    // let topTeam = topMatchup.getWinningTeam();
    // cardRow.appendChild(makeLeagueCards("Best Week", topTeam.teamID, roundToHundred(topTeam.score) + " points", "Week " + topMatchup.weekNumber));
    // let worstWeekMember = getWorstWeekMember(league)[0];
    // let worstWeekObject = getWorstWeekMember(league)[1];
    // cardRow.appendChild(makeLeagueCards("Worst Week", worstWeekMember, roundToHundred(worstWeekObject.activeScore) + " points", "Week " + worstWeekObject.weekNumber));

    // let biggestMOV = league.getLargestMarginOfVictory();
    // cardRow.appendChild(makeHeadToHeadCards("Largest Margin Of Victory", league.getMember(biggestMOV.getWinningTeam().teamID), league.getMember(biggestMOV.getWinningTeam().teamID), biggestMOV.weekNumber));
    // let smallestMOV = league.getSmallestMarginOfVictory();
    // cardRow.appendChild(makeHeadToHeadCards("Slimist Margin Of Victory", league.getMember(smallestMOV.getWinningTeam().teamID), league.getMember(smallestMOV.getWinningTeam().opponentTeamID), smallestMOV.weekNumber));
    //stackedRow.appendChild(stackSpace);
    //q.insertBefore(cardRow, q.childNodes[0]);
    //tabsList.appendChild(q); //adds main league page
    createPowerRankTable(league);

    //create graph page
    graphPage = document.getElementById("graphPage");
    //graphpage contents
    var selectRow = document.createElement('div');
    selectRow.classList.add('row', 'mb-4');

    var pieButton = document.createElement('button');
    pieButton.classList.add('col-2', 'btn', 'btn-outline-info', 'mx-auto');
    var barButton = document.createElement('button');
    var lineButton = document.createElement('button');
    var tradeButton = document.createElement('button');
    // var topGuys = document.createElement('button');
    // topGuys.classList.add('col-2', 'btn', 'btn-outline-info', 'mx-auto');
    // topGuys.onclick = drawLineGraph(myYear.members);
    // topGuys.innerHTML = "Top Players";

    var graphRow = document.createElement('div');
    graphRow.classList.add('row');
    //var stackSpace = document.createElement('div');
    //stackSpace.classList.add('col-12', 'col-sm-12', 'col-md-9', 'col-lg-9', 'col-xl-9');


    var graphContainer = document.createElement('div');
    graphContainer.classList.add('col-12', 'col-sm-12', 'col-md-9', 'col-lg-9', 'col-xl-9', 'graphContainer');
    var stackedCanvas = document.createElement('canvas');
    stackedCanvas.id = "GRAPHCANVAS";
    graphContainer.appendChild(stackedCanvas);
    //var graphOptions = document.createElement('div');
    //graphOptions.classList.add('col-12', 'col-sm-12', 'col-md-3', 'col-lg-3', 'col-xl-3');
    //var graphOptions = createMainGraphOptions();

    selectRow.appendChild(barButton);
    selectRow.appendChild(pieButton);
    selectRow.appendChild(lineButton);
    selectRow.appendChild(tradeButton);
    graphPage.appendChild(selectRow);
    graphRow.appendChild(graphContainer);
    //graphRow.appendChild(graphOptions);

    graphPage.appendChild(graphRow);

    tabsList.appendChild(graphPage); //adds Graph Page
    //createStackedColumns(league);
    createLeagueWeeklyLineChart(league);
    pieButton.onclick = drawPieChart;
    pieButton.innerHTML = "Position Breakdown";

    barButton.classList.add('col-2', 'btn', 'btn-outline-info', 'mx-auto');
    barButton.onclick = drawBarGraph;
    barButton.innerHTML = "PF Breakdown";

    lineButton.classList.add('col-2', 'btn', 'btn-outline-info', 'mx-auto');
    lineButton.onclick = drawLineGraph;
    lineButton.innerHTML = "Weekly Points";

    tradeButton.classList.add('col-2', 'btn', 'btn-outline-info', 'mx-auto');
    tradeButton.onclick = drawTradeWeb;
    tradeButton.innerHTML = "Trade Web";
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
    })
}


function fixNoImage() {
    this.src = "assets/user1.png";
    this.style.backgroundColor = "white";
    this.onerror = null;
}

function makeStatCard(title, main, small, extraSmall, bottom, cardColor, textColor, toolTip) {
    var containment = document.createElement('div');
    containment.classList.add('col-12', 'col-sm-12', 'col-md-6', 'col-lg-6', 'col-xl-2', );
    var card = document.createElement('div');
    card.classList.add('card', 'p-2', 'text-center', 'statcard', 'h-100', 'align-items-center', 'd-flex', 'justify-content-center');

    if (bottom) {
        containment.classList.add('mb-0', 'mt-1');
    } else {
        containment.classList.add('mt-0', 'mb-1');
    }

    card.style.backgroundColor = cardColor;
    card.style.color = textColor;
    var cardTitle = document.createElement('h4');
    cardTitle.classList.add('card-title');
    cardTitle.innerText = title;
    card.appendChild(cardTitle);

    var cardQuote = document.createElement('blockquote');
    cardQuote.classList.add('card-blockquote');
    var cardHead = document.createElement('h2');
    cardHead.innerText = main;
    cardQuote.appendChild(cardHead);
    var cardSmall = document.createElement('small');

    if (toolTip) {
        var infoCon = document.createElement('i');
        infoCon.classList.add("fa", "fa-info-circle");
        cardSmall.setAttribute("data-toggle", "tooltip");
        cardSmall.setAttribute("data-placement", "right");
        cardSmall.setAttribute("title", toolTip);
        cardSmall.innerText = small + " ";
        cardSmall.appendChild(infoCon);
    } else {
        cardSmall.innerText = small;
    }

    cardQuote.appendChild(cardSmall);
    var cardFoot = document.createElement('footer');
    var cardReallySmall = document.createElement('small');
    extraSmall = extraSmall + "";
    if (extraSmall.includes("+") || extraSmall.includes("-")) {
        cardReallySmall.innerText = extraSmall + " League Average";
    } else {
        cardReallySmall.innerText = "Week " + extraSmall;
    }
    cardFoot.appendChild(cardReallySmall);
    cardQuote.appendChild(cardFoot);
    card.appendChild(cardQuote);
    containment.appendChild(card);
    return containment;
}

function createCrossChart(myLeague, divID) {
    var myTable = document.createElement("TABLE");
    myTable.setAttribute("id", "scoreTable");
    document.getElementById(divID).appendChild(myTable);
    var tableHead = document.createElement("TR");
    tableHead.setAttribute("id", "tableHead");
    for (y in myLeague.members[1].pastWeeks) {
        myNum = parseInt(y);
        if (myNum == 0) {
            var headerElement = document.createElement("TD");
            var t = document.createTextNode("Owner");
            headerElement.appendChild(t);
            tableHead.appendChild(headerElement);
        } else {
            var headerElement = document.createElement("TD");
            var t = document.createTextNode("Week " + myNum);
            headerElement.appendChild(t);
            tableHead.appendChild(headerElement);
        }
    }

    var headerElement = document.createElement("TD");
    var t = document.createTextNode("Week " + myLeague.members[1].pastWeeks.length);
    headerElement.appendChild(t);
    tableHead.appendChild(headerElement);
    document.getElementById("scoreTable").appendChild(tableHead);
    for (x in myLeague.members) {
        var q = document.createElement("TR");
        q.setAttribute("id", "myTr");

        var z = document.createElement("TD");
        var h = document.createTextNode(myLeague.members[x].memberFirstName + " " + myLeague.members[x].memberLastName);
        z.appendChild(h);
        q.appendChild(z);
        for (y in myLeague.members[x].pastWeeks) {
            var k = document.createElement("TD");
            var t = document.createTextNode(myLeague.members[x].pastWeeks[y].actualScore);
            k.appendChild(t);
            q.appendChild(k);
        }

        document.getElementById("scoreTable").appendChild(q);
    }
    document.getElementById(divID).appendChild(myTable);

}

function createPwerRankTable(league) {
    var powerRankTable = document.createElement('div');
    powerRankTable.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-12');
    var powerTable = document.createElement('table');
    powerTable.classList.add('table', "hover");
    powerTable.id = "mainPwrTable";
    var tableHead = document.createElement('thead');
    var tableHeader = document.createElement('tr');
    var rankCol = document.createElement('th');
    rankCol.setAttribute('scope', 'col');
    rankCol.appendChild(document.createTextNode('Rank'));
    // var powerRankCol = document.createElement('th');
    // powerRankCol.setAttribute('scope', 'col');
    // powerRankCol.appendChild(document.createTextNode('Power Rank'));
    var teamCol = document.createElement('th');
    teamCol.setAttribute('scope', 'col');
    teamCol.appendChild(document.createTextNode('Team'));
    var recordCol = document.createElement('th');
    recordCol.setAttribute('scope', 'col');
    recordCol.appendChild(document.createTextNode('Record'));
    var winPctCol = document.createElement('th');
    winPctCol.setAttribute('scope', 'col');
    winPctCol.appendChild(document.createTextNode('Win%'));
    var pfCol = document.createElement('th');
    pfCol.setAttribute('scope', 'col');
    pfCol.appendChild(document.createTextNode('PF'));
    var ppCol = document.createElement('th');
    ppCol.setAttribute('scope', 'col');
    ppCol.appendChild(document.createTextNode('PA'));
    var paCol = document.createElement('th');
    paCol.setAttribute('scope', 'col');
    paCol.appendChild(document.createTextNode('PP'));
    tableHeader.appendChild(rankCol);
    tableHeader.appendChild(teamCol);
    tableHeader.appendChild(recordCol);
    tableHeader.appendChild(winPctCol);
    tableHeader.appendChild(pfCol);
    tableHeader.appendChild(ppCol);
    tableHeader.appendChild(paCol);
    tableHead.appendChild(tableHeader);
    var tableBody = document.createElement('tbody');
    for (i = 0; i < league.members.length; i++) {
        let curMember = league.members[i];
        let row = document.createElement('tr');
        let rankCell = document.createElement('td');
        let pwrRankCell = document.createElement('td');
        let teamNameCell = document.createElement('td');
        let recordCell = document.createElement('td');
        let pfCell = document.createElement('td');
        let paCell = document.createElement('td');
        let ppCell = document.createElement('td');
        let pctCell = document.createElement('td');

        pwrRankCell.appendChild(document.createTextNode(curMember.stats.powerRank));
        rankCell.appendChild(document.createTextNode(curMember.stats.finalStanding));
        pfCell.appendChild(document.createTextNode(roundToHundred(curMember.stats.pf)));
        paCell.appendChild(document.createTextNode(roundToHundred(curMember.stats.pa)));
        ppCell.appendChild(document.createTextNode(roundToHundred(curMember.stats.pp)));
        recordCell.appendChild(document.createTextNode(curMember.stats.wins + "-" + curMember.stats.losses));
        teamNameCell.appendChild(document.createTextNode(curMember.teamLocation + " " + curMember.teamNickname));
        pctCell.appendChild(document.createTextNode(roundToHundred(curMember.stats.wins / curMember.stats.losses * 100) + "%"));
        row.appendChild(rankCell);
        //row.appendChild(pwrRankCell);
        row.appendChild(teamNameCell);
        row.appendChild(recordCell);
        row.appendChild(pctCell);
        row.appendChild(pfCell);
        row.appendChild(paCell);
        row.appendChild(ppCell);
        tableBody.appendChild(row);
    }
    powerTable.appendChild(tableHead);
    powerTable.appendChild(tableBody);
    powerRankTable.appendChild(powerTable);
    return powerRankTable;
}

function makeLeagueCards(statName, member, subtext, little) {
    let statContainer = document.createElement('div');
    statContainer.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'col-xl-2', 'my-1');
    let leagueCard = document.createElement('div');
    let leagueCardHeader = document.createElement('h2');
    leagueCard.classList.add('maincard', 'text-center', 'h-100', 'pb-3');

    leagueCardHeader.classList.add('card-title', 'font-weight-bold', 'mt-0', 'pt-3');
    leagueCardHeader.innerText = statName;
    leagueCard.appendChild(leagueCardHeader);
    //leagueCard.appendChild(document.createElement('br'));
    let cardImage = document.createElement('img');
    cardImage.classList.add('newresize', "mt-3");
    cardImage.src = member.logoURL;
    cardImage.addEventListener("error", fixNoImage);
    leagueCard.appendChild(cardImage);
    let sub = document.createElement('h4');
    sub.classList.add('mt-3');
    sub.setAttribute('style', 'margin-left: auto; margin-right: auto;');
    sub.innerText = member.teamLocation + " " + member.teamNickname;
    let mini = document.createElement('h6');
    mini.setAttribute('style', 'margin-left: auto; margin-right: auto;');
    mini.innerText = subtext + " in " + little;
    leagueCard.appendChild(sub);
    leagueCard.appendChild(mini);
    statContainer.appendChild(leagueCard);
    return statContainer;
}

function makeLeagueStatCards(statName, subtext, little) {
    let statContainer = document.createElement('div');
    statContainer.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-2', 'col-xl-2', 'my-1');
    let leagueCard = document.createElement('div');
    let leagueCardHeader = document.createElement('h2');
    leagueCard.classList.add('maincard', 'text-center', 'h-100', 'pb-3');
    leagueCardHeader.classList.add('card-title', 'font-weight-bold', 'mt-0', 'pt-3');
    leagueCardHeader.innerText = statName;
    leagueCard.appendChild(leagueCardHeader);
    leagueCard.appendChild(document.createElement('br'));
    leagueCard.appendChild(document.createElement('br'));
    let sub = document.createElement('h1');
    sub.setAttribute('style', 'margin-left: auto; margin-right: auto;', 'padding-top: auto;');
    sub.innerText = subtext;
    let mini = document.createElement('h6');
    mini.setAttribute('style', 'margin-left: auto; margin-right: auto;');
    mini.innerText = "\nStandard Deviation: " + little + " Points";
    leagueCard.appendChild(sub);
    leagueCard.appendChild(document.createTextNode("Points Per Week"));
    leagueCard.appendChild(mini);
    statContainer.appendChild(leagueCard);
    return statContainer;
}

function drawTradeWeb(members) {

}

function drawPieChart() {
    createLeagueDonutChart(myYear.members)
}

function drawBarGraph() {
    window.myChart.destroy();
    createStackedColumns(myYear);
}

function drawLineGraph() {
    createWeeklyLineCharts(myYear.members);
}

function makeHeadToHeadCards(statName, member, member2, little) {
    let statContainer = document.createElement('div');
    statContainer.classList.add('col-12', 'col-sm-12', 'col-md-7', 'col-lg-5', 'col-xl-3', 'my-1');
    let leagueCard = document.createElement('div');
    let leagueCardHeader = document.createElement('h2');
    leagueCard.classList.add('maincard', 'text-center', 'h-100', 'pb-3');

    leagueCardHeader.classList.add('card-title', 'font-weight-bold', 'mt-0', 'pt-3');
    leagueCardHeader.innerText = statName;
    leagueCard.appendChild(leagueCardHeader);

    h2h = document.createElement('div');
    h2h.classList.add('row', 'w-100', 'nomarg');
    let cardFig = document.createElement('figure');
    let figCap = document.createElement('figcaption');
    //figCap.innerText = member.teamLocation + " " + member.teamNickname + "\n" + roundToHundred(member.pastWeeks[little-1].activeScore) + " Points";
    figCap.style.fontSize = '.9rem';
    cardFig.classList.add('col-5', 'p-0');
    let cardImage = document.createElement('img');
    cardImage.classList.add('newresize', 'col-5', 'p-0');
    cardImage.src = member.logoURL;
    cardImage.addEventListener("error", fixNoImage);
    cardFig.appendChild(cardImage);
    cardFig.appendChild(figCap);

    let cardFig2 = document.createElement('figure');
    let figCap2 = document.createElement('figcaption');
    //figCap2.innerText = member2.teamLocation + " " + member2.teamNickname + "\n" + roundToHundred(member2.pastWeeks[little-1].activeScore) + " Points";
    cardFig2.classList.add('col-5', 'p-0');
    figCap2.style.fontSize = '.9rem';
    let cardImage2 = document.createElement('img');
    cardImage2.classList.add('newresize', 'col-5', 'p-0');
    // cardImage2.src = member2.logoURL;
    // cardImage2.addEventListener("error", fixNoImage);
    // cardFig2.appendChild(cardImage2);
    // cardFig2.appendChild(figCap2);

    let vsText = document.createElement('div');
    vsText.classList.add('col-2', 'font-weight-bold', 'my-auto', 'px-0');
    vsText.appendChild(document.createTextNode('VS'));
    vsText.style.fontSize = '2rem';
    h2h.appendChild(cardFig);
    h2h.appendChild(vsText);
    h2h.appendChild(cardFig2);
    let sub = document.createElement('h3');
    sub.setAttribute('style', 'margin-left: auto; margin-right: auto;');
    //let num = roundToHundred(calcMatchupPointDifference(member.pastWeeks[little-1]));
    sub.innerText = 100 + " Point Difference";
    let mini = document.createElement('h6');
    mini.setAttribute('style', 'margin-left: auto; margin-right: auto;');
    mini.innerText = "week " + little;
    mini.style.fontSize = '.75rem';
    leagueCard.appendChild(h2h);
    vsText.appendChild(mini);
    leagueCard.appendChild(sub);
    statContainer.appendChild(leagueCard);
    return statContainer;
}

function createMainGraphOptions() {
    var containment = document.createElement('div');
    containment.style.backgroundColor = 'lightgrey';
    containment.classList.add('col-12', 'col-sm-12', 'col-md-3', 'col-lg-3', 'col-xl-3')
    for (var i = 0; i < myYear.members.length; i++) {
        let teamRow = document.createElement('div');
        teamRow.classList.add('row');
        let teamCheckBox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "name";
        checkbox.value = "value";
        checkbox.id = "id";

        let teamName = myLeague.members[i].teamName;
        let teamID = myLeague.members[i].teamID;

    }
}