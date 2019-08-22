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
    document.getElementById(SEASON_PORTION.REGULAR).onclick = function(){
        league.seasonPortion = SEASON_PORTION.REGULAR;
        league.resetStats();
        league.setMemberStats(league.getSeasonPortionWeeks());
        for (var i = 1; i <= league.members.length; i++) {
            if($('#' + i).find('a.active').length !== 0) {
                fadeTeam(document.getElementById('teamPill'), league, i);
            } else {
                
            }
        }
    };
        
    document.getElementById(SEASON_PORTION.POST).onclick = function(){
        league.seasonPortion = SEASON_PORTION.POST;
        league.resetStats();
        league.setMemberStats(league.getSeasonPortionWeeks());
        for (var i = 1; i <= league.members.length; i++) {
            if($('#' + i).find('a.active').length !== 0) {
                fadeTeam(document.getElementById('teamPill'), league, i);
            } else {
                
            }
        }
    };
        
    document.getElementById(SEASON_PORTION.ALL).onclick = function(){
        league.seasonPortion = SEASON_PORTION.ALL;
        league.resetStats();
        league.setMemberStats(league.getSeasonPortionWeeks());
        for (var i = 1; i <= league.members.length; i++) {
            if($('#' + i).find('a.active').length !== 0) {
                fadeTeam(document.getElementById('teamPill'), league, i);
            } else {
                
            }
        }
    };
    var l = new Color("#FF0000");
    var r = new Color("#00FF00");
    var nav = document.getElementById("sideNav");
    var tabsList = document.getElementById('tabs-content');
    //<li class="nav-item"><a class="nav-link" data-toggle="pill" href="#menu1"><img src="https://i.imgur.com/bpdH6p4.png" width="25px" height="25px" style = "border-radius:90px;"/></img> Menu 1</a></li>

    //adds league to sidebar
    /*
    let a = document.createElement("li");
    a.classList.add("nav-item", 'align-items-left');
    let b = document.createElement("a");
    b.setAttribute('data-toggle', 'pill');
    b.href = "#leaguePage";
    b.classList.add('nav-link');
    let dash = document.createElement('i');
    dash.classList.add('fas', 'fa-fw', 'fa-tachometer-alt', 'mx-auto');
    b.classList.add('nav-link', "show", 'active')
    b.appendChild(dash);
    //b.appendChild(document.createElement('br'));
    let d = document.createTextNode(" " + myYear.leagueName);
    b.appendChild(d);
    a.appendChild(b);
    nav.appendChild(a);
    */

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
    /*
    for (i in myYear.members) {
        var dropdown = document.getElementById('teamDropdown')
        let a = document.createElement("a");
        a.classList.add("dropdown-item", 'align-items-center', 'd-flex', 'justify-content-center');
        //a.setAttribute('data-toggle', 'pill');
        a.href = "#pillTeam" + myYear.members[i].teamID;
        //a.classList.add('nav-link');
        // let b = document.createElement('img');
        // b.src = myYear.members[i].logoURL;
        // b.style.width = "25px";
        // b.style.height = "25px";
        // b.style.borderRadius = "25px";
        // b.addEventListener("error", fixNoImage);
        // b.style.marginLeft = "auto";
        // b.style.marginRight = "auto";
        // a.appendChild(b);
        // a.appendChild(document.createElement('br'));
        let c = document.createTextNode(" " + myYear.members[i].teamLocation + " " + myYear.members[i].teamNickname);
        //b.appendChild(c);
        a.appendChild(c);
        dropdown.appendChild(a);
    }*/

    //make league main page
    q = document.getElementById("leaguePage");
    //q.classList.add("tab-pane", "fade", "active", "show");
    var cardRow = document.createElement('div');
    cardRow.classList.add('row');
    cardRow.appendChild(makeLeagueStatCards('League Average', league.getLeagueWeeklyAverage(), league.getLeagueStandardDeviation()));
    let topMatchup = league.getOverallBestWeek();
    let topTeam = topMatchup.getWinningTeam();
    cardRow.appendChild(makeLeagueCards("Best Week", topTeam.teamID, roundToHundred(topTeam.score) + " points", "Week " + topMatchup.weekNumber));
    // let worstWeekMember = getWorstWeekMember(league)[0];
    // let worstWeekObject = getWorstWeekMember(league)[1];
    // cardRow.appendChild(makeLeagueCards("Worst Week", worstWeekMember, roundToHundred(worstWeekObject.activeScore) + " points", "Week " + worstWeekObject.weekNumber));

    let biggestMOV = league.getLargestMarginOfVictory();
    cardRow.appendChild(makeHeadToHeadCards("Largest Margin Of Victory", league.getMember(biggestMOV.getWinningTeam().teamID), league.getMember(biggestMOV.getWinningTeam().teamID), biggestMOV.weekNumber));
    let smallestMOV = league.getSmallestMarginOfVictory();
    cardRow.appendChild(makeHeadToHeadCards("Slimist Margin Of Victory", league.getMember(smallestMOV.getWinningTeam().teamID), league.getMember(smallestMOV.getWinningTeam().opponentTeamID), smallestMOV.weekNumber));
    var tRow = document.createElement('div');
    tRow.classList.add('row');
    
    tRow.appendChild(createPwerRankTable(league));
    //stackedRow.appendChild(stackSpace);
    q.appendChild(cardRow);
    q.appendChild(tRow);
    tabsList.appendChild(q); //adds main league page



    //create graph page
    graphPage = document.createElement("div");
    graphPage.id = "graphPage";
    graphPage.classList.add("tab-pane", "fade");
    var crumbLis = document.createElement('ol');
    crumbLis.classList.add('breadcrumb');
    var crumbIte = document.createElement('li');
    crumbIte.classList.add('breadcrumb-item', 'active');
    breadLink = document.createElement('a');
    breadLink.innerText = "Graphs";
    breadLink.href = "#"
    breadLink.onclick = function () {
        $(".nav-link").removeClass('active');
    };
    crumbIte.appendChild(breadLink);
    crumbLis.appendChild(crumbIte);
    graphPage.appendChild(crumbLis);
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
    createStackedColumns(league);
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


    

    //where the magic happens, creates each league page
    // for (var i = 0; i < league.members.length; i++) {
    //     //console.log(myYear.members[i]);
    //     a = document.createElement("div");
    //     a.id = "pillTeam" + league.members[i].teamID;
    //     a.classList.add("tab-pane", "fade");

    //     let crumbList = document.createElement('ol');
    //     crumbList.classList.add('breadcrumb');
    //     let crumbItem = document.createElement('li');
    //     crumbItem.classList.add('breadcrumb-item', 'active');
    //     let breadLink = document.createElement('a');
    //     breadLink.href = '#leaguePage';
    //     breadLink.setAttribute('data-toggle', 'pill');
    //     breadLink.innerText = league.leagueName;
    //     breadLink.onclick = function () {
    //         $(".nav-link").removeClass('active');
    //         $(".breadpill").removeClass('active');
    //     };
    //     breadLink.classList.add("breadpill");
    //     crumbItem.appendChild(breadLink);
    //     crumbList.appendChild(crumbItem);
    //     crumbItem = document.createElement('li');
    //     crumbItem.classList.add('breadcrumb-item', 'active');
    //     crumbItem.innerText = league.members[i].teamLocation + " " + league.members[i].teamNickname;
    //     crumbList.appendChild(crumbItem);
    //     a.appendChild(crumbList);

    //     let mainRow = document.createElement("div");
    //     mainRow.classList.add('row');

    //     let profileContainer = document.createElement('div');
    //     profileContainer.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-2');
    //     let profileCard = document.createElement('div');
    //     profileCard.classList.add('card', 'profilecard', 'p-auto', 'align-items-center', 'd-flex', 'h-100');
    //     let profileImage = document.createElement('img');
    //     profileImage.classList.add('profileImage');
    //     profileImage.src = league.members[i].logoURL;
    //     profileImage.addEventListener("error", fixNoImage);
    //     profileImage.alt = league.members[i].teamAbbrev;
    //     profileCard.appendChild(profileImage);

    //     let profileCardBlock = document.createElement('div');
    //     profileCardBlock.classList.add('card-block', 'problock');

    //     let profileOwnerHeader = document.createElement('h4');
    //     profileOwnerHeader.classList.add('card-title');
    //     profileOwnerHeader.appendChild(document.createTextNode(league.members[i].memberFirstName + " " + league.members[i].memberLastName));
    //     profileCard.appendChild(profileOwnerHeader);

    //     let profileMinorText = document.createElement('h5');
    //     profileMinorText.classList.add('card-text');
    //     profileMinorText.innerText = ordinal_suffix_of(league.members[i].finalStanding) + " Overall";
    //     profileCard.appendChild(profileMinorText);

    //     profileText = document.createElement('h5');
    //     profileText.innerText = "Record: " + league.members[i].record.overall.wins + "-" + league.members[i].record.overall.losses;
    //     profileCard.appendChild(profileText);
    //     profileContainer.appendChild(profileCard);
    //     mainRow.appendChild(profileContainer); //profile card added

    //     let miniMainCol = document.createElement("div");
    //     miniMainCol.classList.add('col-12', 'col-xs-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-10', 'mt-0', "mb-0");

    //     let miniColOne = document.createElement("div");
    //     miniColOne.classList.add('row', 'h-100');

    //     let memberPF = roundToHundred(league.members[i].completeSeasonPoints);
    //     let leaguePF = getLeaguePF(league);
    //     let difference = roundToTen(memberPF - leaguePF);
    //     if (difference > 0) {
    //         difference = "+" + difference;
    //     }



    //     let cardColor = getCardColor(getPFFinish(league, league.members[i]), league.members.length);
    //     let textColor = getTextColor(getPFFinish(league, league.members[i]), league.members.length);
    //     let statCardPF = makeStatCard((ordinal_suffix_of(getPFFinish(league, league.members[i])) + " in Points Scored"), memberPF, "Points Scored", difference, false, cardColor, textColor, "Points scored in both the regular and post season");
    //     miniColOne.appendChild(statCardPF);

    //     let memberPA = roundToHundred(league.members[i].completeSeasonPointsAgainst);
    //     let leaguePA = getLeaguePA(league);
    //     difference = roundToHundred(memberPA - leaguePA);
    //     if (difference > 0) {
    //         difference = "+" + difference;
    //     }



    //     cardColor = getCardColor(getPAFinish(league, league.members[i]), league.members.length);
    //     textColor = getTextColor(getPAFinish(league, league.members[i]), league.members.length);
    //     let statCardPA = makeStatCard((ordinal_suffix_of(getPAFinish(league, league.members[i])) + " Hardest Schedule"), memberPA, "Points Against", difference, false, "#ffffff", "#000000", "Total points scored by all opponents in the regular and post season");
    //     miniColOne.appendChild(statCardPA);

    //     let memberPP = getPotentialPoints(league.members[i]);
    //     let leaguePP = getLeaguePP(league);
    //     difference = roundToTen(memberPP - leaguePP);
    //     if (difference > 0) {
    //         difference = "+" + difference;
    //     }


    //     cardColor = getCardColor(getPPFinish(league, league.members[i]), league.members.length);
    //     textColor = getTextColor(getPPFinish(league, league.members[i]), league.members.length);
    //     let statCardPP = makeStatCard((ordinal_suffix_of(getPPFinish(league, league.members[i])) + " in Potential Points"), roundToHundred(getPotentialPoints(league.members[i])), "Potential Points", difference, false, cardColor, textColor, "Total points achievable by always playing the most optimal lineup");
    //     miniColOne.appendChild(statCardPP);

    //     difference = roundToTen(memberPP - memberPF);
    //     if (difference > 0) {
    //         difference = "+" + difference;
    //     }
    //     let ldifference = roundToTen(difference - getPPDifferenceFinishLeague(league));
    //     if (ldifference > 0) {
    //         ldifference = "+" + ldifference;
    //     }


    //     cardColor = getCardColor(getPPDifferenceFinish(league, league.members[i]), league.members.length);
    //     textColor = getTextColor(getPPDifferenceFinish(league, league.members[i]), league.members.length);
    //     let statCardPPDifference = makeStatCard((ordinal_suffix_of(getPPDifferenceFinish(league, league.members[i])) + " In Efficiency"), difference, "Potential Point Gap", ldifference, false, cardColor, textColor, "Difference between points scored and possible points, the smaller the gap the better");
    //     miniColOne.appendChild(statCardPPDifference);

    //     let mvpContainer = document.createElement('div');
    //     mvpContainer.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-4', 'mt-0', 'mb-1');
    //     let mvpCard = document.createElement('div');
    //     let mvpHeader = document.createElement('h1');
    //     mvpCard.classList.add('card', 'mvpcard', 'text-center', 'h-100', 'justify-content-center', 'align-items-center', 'px-1');

    //     mvpHeader.classList.add('card-title', 'pt-3');
    //     mvpHeader.innerText = 'Most Valuable Player';
    //     mvpCard.appendChild(mvpHeader);

    //     let mvpImage = document.createElement('img');
    //     mvpImage.classList.add('resize', 'rounded-circle');
    //     let teamMVP = getMVP(league.members[i]);
    //     if (teamMVP.position == "D/ST") {

    //         mvpImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(teamMVP.realTeamID) + ".png&h=150&w=150";
    //     } else {
    //         mvpImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + teamMVP.playerId + ".png";
    //     }
    //     mvpCard.appendChild(mvpImage);

    //     let mvpName = teamMVP.firstName + " " + teamMVP.lastName;
    //     let mvpNameElement = document.createElement('h4');
    //     mvpNameElement.setAttribute('style', 'margin-left: auto; margin-right: auto;');
    //     mvpNameElement.innerText = mvpName + "\n" + teamMVP.totalSeasonScore + " Points";
    //     mvpCard.appendChild(mvpNameElement);
    //     mvpContainer.appendChild(mvpCard);

    //     miniColOne.appendChild(mvpContainer);


    //     let weekAvg = memberPF / league.members[i].pastWeeks.length;
    //     difference = roundToHundred(weekAvg - getLeagueWeeklyAverage(league.members));
    //     if (difference > 0) {
    //         difference = "+" + difference;
    //     }

    //     cardColor = getCardColor(getPFFinish(league, league.members[i]), league.members.length);
    //     // weeklyAverageCard.style.color = getTextColor(getCardColor(getPFFinish(myYear, myYear.members[i]), myYear.members.length));
    //     textColor = getTextColor(getPFFinish(league, league.members[i]), league.members.length);
    //     let weeklyAverageCard = makeStatCard("Weekly Average", roundToHundred(weekAvg), "Points Per Week", difference, true, cardColor, textColor, "Average points scored per week");
    //     miniColOne.appendChild(weeklyAverageCard);

    //     let memberSTD = getStandardDeviation(league.members[i]);
    //     let leagueSTD = getLeagueStandardDeviation(league);
    //     difference = roundToTen(memberSTD - leagueSTD);
    //     if (difference > 0) {
    //         difference = "+" + difference;
    //     }

    //     cardColor = getCardColor(getStandardDeviationFinish(league, league.members[i]), league.members.length);
    //     // stdCard.style.color = getTextColor(getCardColor(getStandardDeviationFinish(myYear, myYear.members[i]), myYear.members.length));
    //     textColor = getTextColor(getStandardDeviationFinish(league, league.members[i]), league.members.length);
    //     let stdCard = makeStatCard((ordinal_suffix_of(getStandardDeviationFinish(league, league.members[i])) + " Most Consistent"), roundToHundred(getStandardDeviation(league.members[i])), "Standard Deviation", difference, true, cardColor, textColor, "Indicates weekly variation of points a team had from their average \nLower is better");
    //     miniColOne.appendChild(stdCard);

    //     cardColor = getCardColor(getBestWeekFinish(league, league.members[i]), league.members.length);
    //     // bestWeekCard.style.color = getTextColor(getCardColor(getBestWeekFinish(myYear, myYear.members[i]), getTotalWeeks(myYear)));
    //     textColor = getTextColor(getBestWeekFinish(league, league.members[i]), league.members.length);
    //     let bestWeekCard = makeStatCard("Best Week", roundToHundred(getBestWeek(league.members[i]).activeScore), ordinal_suffix_of(getBestWeekFinish(league, league.members[i])) + " Highest", getBestWeek(league.members[i]).weekNumber, true, cardColor, textColor, "Only represents the comparison against every other teams single highest week");
    //     miniColOne.appendChild(bestWeekCard);

    //     cardColor = getInverseCardColor(getWorstWeekFinish(league, league.members[i]), league.members.length);
    //     // worstWeekCard.style.color = getTextColor(getInverseCardColor(getWorstWeekFinish(myYear, myYear.members[i]), getTotalWeeks(myYear)));
    //     textColor = getTextColor(league.members.length - getWorstWeekFinish(league, league.members[i]), league.members.length);
    //     let worstWeekCard = makeStatCard("Worst Week", roundToHundred(getWorstWeek(league.members[i]).activeScore), ordinal_suffix_of(getWorstWeekFinish(league, league.members[i])) + " Worst", getWorstWeek(league.members[i]).weekNumber, true, cardColor, textColor, "Only represents the comparison against every other teams single lowest week");
    //     miniColOne.appendChild(worstWeekCard);

    //     let worstContainer = document.createElement('div');
    //     worstContainer.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-4', 'mt-0', 'mb-1');
    //     let worstPlayerCard = document.createElement('div');
    //     let wvpHeader = document.createElement('h1');
    //     worstPlayerCard.classList.add('card', 'mvpcard', 'text-center', 'h-100', 'justify-content-center', 'align-items-center', 'px-1');
    //     wvpHeader.classList.add('card-title', 'pt-3');
    //     wvpHeader.innerText = 'Least Valuable Player';
    //     worstPlayerCard.appendChild(wvpHeader);

    //     let wvpImage = document.createElement('img');
    //     wvpImage.classList.add('resize', 'rounded-circle');
    //     let teamWorstPlayer = getWVPWeek(league.members[i]);
    //     if (teamWorstPlayer.position == "D/ST") {
    //         wvpImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(teamWorstPlayer.realTeamID) + ".png&h=150&w=150";
    //     } else {
    //         wvpImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + teamWorstPlayer.playerID + ".png";
    //     }
    //     worstPlayerCard.appendChild(wvpImage);
    //     let wvpName;
    //     if (teamWorstPlayer.position == "D/ST") {
    //         wvpName = teamWorstPlayer.firstName + " D/ST\n";
    //     } else {
    //         wvpName = teamWorstPlayer.firstName + " " + teamWorstPlayer.lastName + "\n";
    //     }

    //     let wvpNameElement = document.createElement('h4');
    //     wvpNameElement.setAttribute('style', 'margin-left: auto; margin-right: auto;');
    //     wvpNameElement.innerText = wvpName + " " + teamWorstPlayer.actualScore + " Points in Week " + teamWorstPlayer.week;

    //     worstPlayerCard.appendChild(wvpNameElement);
    //     worstContainer.appendChild(worstPlayerCard);
    //     miniColOne.appendChild(worstContainer);

    //     //add all
    //     miniMainCol.appendChild(miniColOne);
    //     mainRow.appendChild(miniMainCol);
    //     a.appendChild(mainRow);
    //     let chartsRow = document.createElement('div');
    //     chartsRow.classList.add('row');
    //     let lineSpace = document.createElement('div');
    //     lineSpace.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-9');
    //     linecan = document.createElement('canvas');
    //     linecan.id = league.members[i].teamID + "LINECHART";
    //     lineSpace.appendChild(linecan);
    //     chartsRow.appendChild(lineSpace);

    //     let donutSpace = document.createElement('div');
    //     donutSpace.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-3', 'donutchart');
    //     donutcan = document.createElement('canvas');
    //     donutcan.classList.add('DONUTCANVAS1');
    //     donutcan.id = league.members[i].teamID + "DONUTCANVAS";
    //     donutSpace.appendChild(donutcan);
    //     chartsRow.appendChild(donutSpace);
    //     a.appendChild(chartsRow);

    //     tabsList.appendChild(a);
    //     createWeeklyLineChart(league.members[i], league);
    //     createDonutChart(league.members[i]);
    // }
    $('#mainPwrTable').DataTable({
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
    this.src = 'https://pbs.twimg.com/profile_images/378800000727004025/8d72d52ef9a33058eb34b31c3a97560e_400x400.jpeg';
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

function createPwerRankTable(myYear) {
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
    for (i = 0; i < myYear.members.length; i++) {
        let curMember = myYear.members[i];
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
        pctCell.appendChild(document.createTextNode(roundToHundred(curMember.stats.wins/curMember.stats.losses * 100) + "%"));
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

function drawTradeWeb(members){

}

function drawPieChart(){
    createLeagueDonutChart(myYear.members)
}

function drawBarGraph(){
    window.myChart.destroy();
    createStackedColumns(myYear);
}

function drawLineGraph(){
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

function createMainGraphOptions(){
    var containment = document.createElement('div');
    containment.style.backgroundColor = 'lightgrey';
    containment.classList.add('col-12', 'col-sm-12', 'col-md-3', 'col-lg-3', 'col-xl-3')
    for (var i = 0; i < myYear.members.length; i++){
        let teamRow  = document.createElement('div');
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