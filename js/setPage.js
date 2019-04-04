
function setPage(myYear) {
    //console.log("Running setpage");
    console.log(myYear);
    var l = new Color("#FF0000");
    var r = new Color("#00FF00");
    var nav = document.getElementById("sideNav");
    var tabsList = document.getElementById('tabs-content');
    //<li class="nav-item"><a class="nav-link" data-toggle="pill" href="#menu1"><img src="https://i.imgur.com/bpdH6p4.png" width="25px" height="25px" style = "border-radius:90px;"/></img> Menu 1</a></li>

    //adds league to sidebar
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

    //adds teams to sidebar
    for (i in myYear.members) {
        let a = document.createElement("li");
        a.classList.add("nav-item", 'align-items-left', 'side-item');
        a.onclick = function() {$(".nav-link").removeClass('active');};
        let b = document.createElement("a");
        b.setAttribute('data-toggle', 'pill');
        b.href = "#pillTeam" + myYear.members[i].teamID;
        b.classList.add('nav-link')
        let c = document.createElement('img');
        c.src = myYear.members[i].logoURL;
        c.style.width = "25px";
        c.style.height = "25px";
        c.style.borderRadius = "25px";
        c.addEventListener("error", fixNoImage);
        c.style.marginLeft = "auto";
        c.style.marginRight = "auto";
        b.appendChild(c);
        //b.appendChild(document.createElement('br'));
        let d = document.createTextNode(" " + myYear.members[i].teamLocation + " " + myYear.members[i].teamNickname);
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
    q = document.createElement("div");
    q.id = "leaguePage";
    q.classList.add("tab-pane", "fade", "active", "show");

    var crumbList = document.createElement('ol');
    crumbList.classList.add('breadcrumb');
    var crumbItem = document.createElement('li');
    crumbItem.classList.add('breadcrumb-item', 'active');
    let breadLink = document.createElement('a');
    breadLink.innerText = " ***LEAGUE DASHBOARD CURRENTLY UNDER CONSTRUCTION*** ";
    breadLink.href = "#"
    crumbItem.appendChild(breadLink);
    crumbList.appendChild(crumbItem);
    q.appendChild(crumbList);
    var stackedRow = document.createElement('div');
    stackedRow.classList.add('row');
    var stackSpace = document.createElement('div');
    stackSpace.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-12');
    var stackedCanvas = document.createElement('canvas');
    stackedCanvas.id = "LEAGUESTACKEDCANVAS";
    stackedRow.appendChild(stackedCanvas);
    q.appendChild(stackedRow);
    tabsList.appendChild(q);
    createStackedColumns(myYear);
    
    //where the magic happens, creates each league page
    for (var i = 0; i < myYear.members.length; i++) {
        //console.log(myYear.members[i]);
        a = document.createElement("div");
        a.id = "pillTeam" + myYear.members[i].teamID;
        a.classList.add("tab-pane", "fade");

        let crumbList = document.createElement('ol');
        crumbList.classList.add('breadcrumb');
        let crumbItem = document.createElement('li');
        crumbItem.classList.add('breadcrumb-item', 'active');
        let breadLink = document.createElement('a');
        breadLink.href = '#leaguePage';
        breadLink.setAttribute('data-toggle', 'pill');
        breadLink.innerText = myYear.leagueName;
        crumbItem.appendChild(breadLink);
        crumbList.appendChild(crumbItem);
        crumbItem = document.createElement('li');
        crumbItem.classList.add('breadcrumb-item', 'active');
        crumbItem.innerText = myYear.members[i].teamLocation + " " + myYear.members[i].teamNickname;
        crumbList.appendChild(crumbItem);
        a.appendChild(crumbList);

        let mainRow = document.createElement("div");
        mainRow.classList.add('row');

        let profileContainer = document.createElement('div');
        profileContainer.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-2');
        let profileCard = document.createElement('div');
        profileCard.classList.add('card', 'profilecard', 'p-auto', 'align-items-center', 'd-flex', 'h-100');
        let profileImage = document.createElement('img');
        profileImage.classList.add('profileImage');
        profileImage.src = myYear.members[i].logoURL;
        profileImage.addEventListener("error", fixNoImage);
        profileImage.alt = myYear.members[i].teamAbbrev;
        profileCard.appendChild(profileImage);

        let profileCardBlock = document.createElement('div');
        profileCardBlock.classList.add('card-block', 'problock');

        let profileOwnerHeader = document.createElement('h4');
        profileOwnerHeader.classList.add('card-title');
        profileOwnerHeader.appendChild(document.createTextNode(myYear.members[i].memberFirstName + " " + myYear.members[i].memberLastName));
        profileCard.appendChild(profileOwnerHeader);

        let profileMinorText = document.createElement('h5');
        profileMinorText.classList.add('card-text');
        profileMinorText.innerText = ordinal_suffix_of(myYear.members[i].finalStanding) + " Overall";
        profileCard.appendChild(profileMinorText);

        profileText = document.createElement('h5');
        profileText.innerText = "Record: " + myYear.members[i].record.overall.wins + "-" + myYear.members[i].record.overall.losses;
        profileCard.appendChild(profileText);
        profileContainer.appendChild(profileCard);
        mainRow.appendChild(profileContainer); //profile card added

        let miniMainCol = document.createElement("div");
        miniMainCol.classList.add('col-12', 'col-xs-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-10', 'mt-0', "mb-0");

        let miniColOne = document.createElement("div");
        miniColOne.classList.add('row', 'h-100');

        let memberPF = roundToHundred(myYear.members[i].completeSeasonPoints);
        let leaguePF = getLeaguePF(myYear);
        let difference = roundToTen(memberPF - leaguePF);
        if (difference > 0) {
            difference = "+" + difference;
        }



        let cardColor = getCardColor(getPFFinish(myYear, myYear.members[i]), myYear.members.length);
        let textColor = getTextColor(getPFFinish(myYear, myYear.members[i]), myYear.members.length);
        let statCardPF = makeStatCard((ordinal_suffix_of(getPFFinish(myYear, myYear.members[i])) + " in Points Scored"), memberPF, "Points Scored", difference, false, cardColor, textColor, "Points scored in both the regular and post season");
        miniColOne.appendChild(statCardPF);

        let memberPA = roundToHundred(myYear.members[i].completeSeasonPointsAgainst);
        let leaguePA = getLeaguePA(myYear);
        difference = roundToHundred(memberPA - leaguePA);
        if (difference > 0) {
            difference = "+" + difference;
        }



        cardColor = getCardColor(getPAFinish(myYear, myYear.members[i]), myYear.members.length);
        textColor = getTextColor(getPAFinish(myYear, myYear.members[i]), myYear.members.length);
        let statCardPA = makeStatCard((ordinal_suffix_of(getPAFinish(myYear, myYear.members[i])) + " Hardest Schedule"), memberPA, "Points Against", difference, false, "#ffffff", "#000000", "Total points scored by all opponents in the regular and post season");
        miniColOne.appendChild(statCardPA);

        let memberPP = getPotentialPoints(myYear.members[i]);
        let leaguePP = getLeaguePP(myYear);
        difference = roundToTen(memberPP - leaguePP);
        if (difference > 0) {
            difference = "+" + difference;
        }


        cardColor = getCardColor(getPPFinish(myYear, myYear.members[i]), myYear.members.length);
        textColor = getTextColor(getPPFinish(myYear, myYear.members[i]), myYear.members.length);
        let statCardPP = makeStatCard((ordinal_suffix_of(getPPFinish(myYear, myYear.members[i])) + " in Potential Points"), roundToHundred(getPotentialPoints(myYear.members[i])), "Potential Points", difference, false, cardColor, textColor, "Total points achievable by always playing the most optimal lineup");
        miniColOne.appendChild(statCardPP);

        difference = roundToTen(memberPP - memberPF);
        if (difference > 0) {
            difference = "+" + difference;
        }
        let ldifference = roundToTen(difference - getPPDifferenceFinishLeague(myYear));
        if (ldifference > 0) {
            ldifference = "+" + ldifference;
        }


        cardColor = getCardColor(getPPDifferenceFinish(myYear, myYear.members[i]), myYear.members.length);
        textColor = getTextColor(getPPDifferenceFinish(myYear, myYear.members[i]), myYear.members.length);
        let statCardPPDifference = makeStatCard((ordinal_suffix_of(getPPDifferenceFinish(myYear, myYear.members[i])) + " In Efficiency"), difference, "Potential Point Gap", ldifference, false, cardColor, textColor, "Difference between points scored and possible points, the smaller the gap the better");
        miniColOne.appendChild(statCardPPDifference);

        let mvpContainer = document.createElement('div');
        mvpContainer.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-4', 'mt-0', 'mb-1');
        let mvpCard = document.createElement('div');
        let mvpHeader = document.createElement('h1');
        mvpCard.classList.add('card', 'mvpcard', 'text-center', 'h-100', 'justify-content-center', 'align-items-center');

        mvpHeader.classList.add('card-title');
        mvpHeader.innerText = 'Most Valuable Player';
        mvpCard.appendChild(mvpHeader);

        let mvpImage = document.createElement('img');
        mvpImage.classList.add('resize', 'rounded-circle');
        let teamMVP = getMVP(myYear.members[i]);
        if (teamMVP.position == "D/ST") {
            
            mvpImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(teamMVP.realTeamID) + ".png&h=150&w=150";
        } else {
            mvpImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + teamMVP.playerId + ".png";
        }
        mvpCard.appendChild(mvpImage);

        let mvpName = teamMVP.firstName + " " + teamMVP.lastName;
        let mvpNameElement = document.createElement('h4');
        mvpNameElement.setAttribute('style', 'margin-left: auto; margin-right: auto;');
        mvpNameElement.innerText = mvpName + "\n" + teamMVP.totalSeasonScore + " Points";
        mvpCard.appendChild(mvpNameElement);
        mvpContainer.appendChild(mvpCard);

        miniColOne.appendChild(mvpContainer);


        let weekAvg = memberPF / myYear.members[i].pastWeeks.length;
        difference = weekAvg - getLeagueWeeklyAverage(myYear.members);
        if (difference > 0) {
            difference = "+" + roundToHundred(difference);
        }

        cardColor = getCardColor(getPFFinish(myYear, myYear.members[i]), myYear.members.length);
        // weeklyAverageCard.style.color = getTextColor(getCardColor(getPFFinish(myYear, myYear.members[i]), myYear.members.length));
        textColor = getTextColor(getPFFinish(myYear, myYear.members[i]), myYear.members.length);
        let weeklyAverageCard = makeStatCard("Weekly Average", roundToHundred(weekAvg), "Points Per Week", difference, true, cardColor, textColor, "Average points scored per week");
        miniColOne.appendChild(weeklyAverageCard);

        let memberSTD = getStandardDeviation(myYear.members[i]);
        let leagueSTD = getLeagueStandardDeviation(myYear);
        difference = roundToTen(memberSTD - leagueSTD);
        if (difference > 0) {
            difference = "+" + difference;
        }

        cardColor = getCardColor(getStandardDeviationFinish(myYear, myYear.members[i]), myYear.members.length);
        // stdCard.style.color = getTextColor(getCardColor(getStandardDeviationFinish(myYear, myYear.members[i]), myYear.members.length));
        textColor = getTextColor(getStandardDeviationFinish(myYear, myYear.members[i]), myYear.members.length);
        let stdCard = makeStatCard((ordinal_suffix_of(getStandardDeviationFinish(myYear, myYear.members[i])) + " Most Consistent"), roundToHundred(getStandardDeviation(myYear.members[i])), "Standard Deviation", difference, true, cardColor, textColor, "Indicates weekly variation of points a team had from their average \nLower is better");
        miniColOne.appendChild(stdCard);

        cardColor = getCardColor(getBestWeekFinish(myYear, myYear.members[i]), getTotalWeeks(myYear));
        // bestWeekCard.style.color = getTextColor(getCardColor(getBestWeekFinish(myYear, myYear.members[i]), getTotalWeeks(myYear)));
        textColor = getTextColor(getBestWeekFinish(myYear, myYear.members[i]), getTotalWeeks(myYear));
        let bestWeekCard = makeStatCard("Best Week", roundToHundred(getBestWeek(myYear.members[i]).activeScore), ordinal_suffix_of(getBestWeekFinish(myYear, myYear.members[i])) + " Highest", getBestWeek(myYear.members[i]).weekNumber, true, cardColor, textColor, "Only represents the comparison against every other teams single highest week");
        miniColOne.appendChild(bestWeekCard);

        cardColor = getInverseCardColor(getWorstWeekFinish(myYear, myYear.members[i]), myYear.members.length);
        // worstWeekCard.style.color = getTextColor(getInverseCardColor(getWorstWeekFinish(myYear, myYear.members[i]), getTotalWeeks(myYear)));
        textColor = getTextColor(getWorstWeekFinish(myYear, myYear.members[i]), getTotalWeeks(myYear));
        let worstWeekCard = makeStatCard("Worst Week", roundToHundred(getWorstWeek(myYear.members[i]).activeScore), ordinal_suffix_of(getWorstWeekFinish(myYear, myYear.members[i])) + " Worst", getWorstWeek(myYear.members[i]).weekNumber, true, cardColor, textColor, "Only represents the comparison against every other teams single lowest week");
        miniColOne.appendChild(worstWeekCard);

        let worstContainer = document.createElement('div');
        worstContainer.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-4', 'mb-0', 'mt-1');
        let worstPlayerCard = document.createElement('div');
        let wvpHeader = document.createElement('h1');
        worstPlayerCard.classList.add('card', 'mvpcard', 'text-center', 'h-100','justify-content-center', 'align-items-center');
        wvpHeader.classList.add('card-title');
        wvpHeader.innerText = 'Least Valuable Player';
        worstPlayerCard.appendChild(wvpHeader);

        let wvpImage = document.createElement('img');
        wvpImage.classList.add('resize', 'rounded-circle');
        let teamWorstPlayer = getWVPWeek(myYear.members[i]);
        if (teamWorstPlayer.position == "D/ST") {
            wvpImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(teamWorstPlayer.realTeamID) + ".png&h=150&w=150";
        } else {
            wvpImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + teamWorstPlayer.playerID + ".png";
        }
        worstPlayerCard.appendChild(wvpImage);
        let wvpName;
        if (teamWorstPlayer.position == "D/ST") {
            wvpName = teamWorstPlayer.firstName + ", ";
        } else {
            wvpName = teamWorstPlayer.firstName + " " + teamWorstPlayer.lastName + "\n";
        }

        let wvpNameElement = document.createElement('h5');
        wvpNameElement.setAttribute('style', 'margin-left: auto; margin-right: auto;');
        wvpNameElement.innerText = wvpName + " " + teamWorstPlayer.actualScore + " Points in Week " + teamWorstPlayer.week;

        worstPlayerCard.appendChild(wvpNameElement);
        worstContainer.appendChild(worstPlayerCard);
        miniColOne.appendChild(worstContainer);

        //add all
        miniMainCol.appendChild(miniColOne);
        mainRow.appendChild(miniMainCol);
        a.appendChild(mainRow);
        let chartsRow = document.createElement('div');
        chartsRow.classList.add('row');
        let lineSpace = document.createElement('div');
        lineSpace.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-9');
        linecan = document.createElement('canvas');
        linecan.id = myYear.members[i].teamID + "LINECHART";
        lineSpace.appendChild(linecan);
        chartsRow.appendChild(lineSpace);

        let donutSpace = document.createElement('div');
        donutSpace.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-3', 'donutchart');
        donutcan = document.createElement('canvas');
        donutcan.classList.add('DONUTCANVAS1');
        donutcan.id = myYear.members[i].teamID + "DONUTCANVAS";
        donutSpace.appendChild(donutcan);
        chartsRow.appendChild(donutSpace);
        a.appendChild(chartsRow);

        tabsList.appendChild(a);
        createWeeklyLineChart(myYear.members[i], myYear);
        createDonutChart(myYear.members[i]);
    }
    
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