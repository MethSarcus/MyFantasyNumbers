//Things to fix
//Fix PF
//Fix Weekly Average
//Fix worst week number
//Fix weekly league average
//Efficiency and potential points need work
//
//
//
//
//

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
    a.classList.add("nav-item", 'align-items-center', 'd-flex', 'justify-content-center');
    let b = document.createElement("a");
    b.setAttribute('data-toggle', 'pill');
    b.href = "#leaguePage";
    b.classList.add('nav-link', );
    let dash = document.createElement('i');
    dash.classList.add('fas', 'fa-fw', 'fa-tachometer-alt', 'mx-auto');
    b.classList.add('nav-link', "show", 'active')
    b.appendChild(dash);
    b.appendChild(document.createElement('br'));
    let d = document.createTextNode(myYear.leagueName);
    b.appendChild(d);
    a.appendChild(b);
    nav.appendChild(a);

    //adds teams to sidebar
    for (i in myYear.members) {
        let a = document.createElement("li");
        a.classList.add("nav-item", 'align-items-center', 'd-flex', 'justify-content-center');
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
        b.appendChild(document.createElement('br'));
        let d = document.createTextNode(" " + myYear.members[i].teamLocation + " " + myYear.members[i].teamNickname);
        b.appendChild(d);
        a.appendChild(b);
        nav.appendChild(a);
    }


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


    
    // tabsList.insertBefore(q, tabsList.firstChild);



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
        // profileImage.height = "33%";
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
        // profileCard.appendChild(profileCardBlock);
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
        //statCardPF.style.color = getTextColor(getCardColor(getPFFinish(myYear, myYear.members[i]), myYear.members.length));
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
        //statCardPA.style.color = getTextColor(getCardColor(getPAFinish(myYear, myYear.members[i]), myYear.members.length));
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
        //statCardPP.style.color = getTextColor(getCardColor(getPPFinish(myYear, myYear.members[i]), myYear.members.length));
        textColor = getTextColor(getPPFinish(myYear, myYear.members[i]), myYear.members.length);
        let statCardPP = makeStatCard((ordinal_suffix_of(getPPFinish(myYear, myYear.members[i])) + " in Possible Points"), Math.round(getPotentialPoints(myYear.members[i]) * 10) / 10, "Potential Points", difference, false, cardColor, textColor, "Total points achievable by always playing the most optimal lineup");
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
        // statCardPPDifference.style.color = getTextColor(getCardColor(getPPDifferenceFinish(myYear, myYear.members[i]), myYear.members.length));
        textColor = getTextColor(getPPDifferenceFinish(myYear, myYear.members[i]), myYear.members.length);
        let statCardPPDifference = makeStatCard((ordinal_suffix_of(getPPDifferenceFinish(myYear, myYear.members[i])) + " In Efficiency"), difference, "Potential Point Gap", ldifference, false, cardColor, textColor, "Difference between points scored and possible points, the smaller the gap the better");
        miniColOne.appendChild(statCardPPDifference);

        let mvpContainer = document.createElement('div');
        mvpContainer.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-12', 'col-xl-4', 'mt-0', 'mb-1');
        let mvpCard = document.createElement('div');
        let mvpHeader = document.createElement('h1');
        mvpCard.classList.add('card', 'mvpcard', 'text-center', 'h-100', 'justify-content-center', 'align-items-center');

        mvpHeader.classList.add('card-title');
        mvpHeader.innerText = 'Team MVP';
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
        // let temp = document.createElement('h4');
        // temp.innerText = teamMVP.totalSeasonScore;
        // mvpCard.appendChild(temp);

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
        wvpHeader.innerText = 'Worst Player';
        worstPlayerCard.appendChild(wvpHeader);

        let wvpImage = document.createElement('img');
        wvpImage.classList.add('resize', 'rounded-circle');
        let teamWorstPlayer = getWVPWeek(myYear.members[i]);
        if (teamWorstPlayer.position == "D/ST") {
            //console.log(teamWorstPlayer);
            wvpImage.src = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(teamWorstPlayer.realTeamID) + ".png&h=150&w=150";
        } else {
            wvpImage.src = "http://a.espncdn.com/i/headshots/nfl/players/full/" + teamWorstPlayer.playerId + ".png";
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
        //temp.innerText = teamWorstPlayer.totalSeasonScore;
        //worstPlayerCard.appendChild(temp);
        worstContainer.appendChild(worstPlayerCard);
        miniColOne.appendChild(worstContainer);




        //add all
        miniMainCol.appendChild(miniColOne);
        //miniMainCol.appendChild(miniColTwo);
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
        //console.log(myYear.members[i]);
        createWeeklyLineChart(myYear.members[i], myYear);
        createDonutChart(myYear.members[i]);
    }
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })



}

function makeTeamPages(myYear) {

}

function fixNoImage() {
    this.src = 'https://pbs.twimg.com/profile_images/378800000727004025/8d72d52ef9a33058eb34b31c3a97560e_400x400.jpeg';
    this.onerror = null;

}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
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

function getLeaguePF(myYear) {
    var totalPoints = 0;
    for (i in myYear.members) {
        totalPoints += myYear.members[i].completeSeasonPoints;
    }

    return roundToHundred(totalPoints / myYear.members.length);
}

function getLeaguePA(myYear) {
    var totalPoints = 0;
    for (i in myYear.members) {
        totalPoints += myYear.members[i].completeSeasonPointsAgainst;
    }

    return (Math.round((totalPoints / myYear.members.length) * 10) / 10);
}

function getLeaguePP(myYear) {
    var totalPoints = 0;
    for (i in myYear.members) {
        totalPoints += getPotentialPoints(myYear.members[i]);
    }

    return (Math.round((totalPoints / myYear.members.length) * 10) / 10);
}



function getPFFinish(myYear, person) {
    var greaterCount = 1;
    for (i in myYear.members) {
        if (person.completeSeasonPoints < myYear.members[i].completeSeasonPoints) {
            greaterCount += 1;
        }
    }

    return greaterCount;
}

function getPAFinish(myYear, person) {
    var greaterCount = 1;
    for (i in myYear.members) {
        if (person.completeSeasonPointsAgainst < myYear.members[i].completeSeasonPointsAgainst) {
            greaterCount += 1;
        }
    }

    return greaterCount;
}


function getPotentialPoints(member) {
    //console.log(member.pastWeeks);
    var myPoints = 0;

    for (j in member.pastWeeks) {
        myPoints += member.pastWeeks[j].potentialPoints;

    }

    return myPoints;
}

function getMVP(leagueMember) {
    var totalPlayers = [];
    var highestScoring;
    //console.log("ran");
    //console.log(leagueMember);
    for (x in leagueMember.pastWeeks) {
        for (y in leagueMember.pastWeeks[x].activePlayers) {
            let curPlayer = leagueMember.pastWeeks[x].activePlayers[y];
            if (inMVPArray(curPlayer.playerID, totalPlayers) == true) {
                for (i in totalPlayers) {
                    if (totalPlayers[i].playerId == curPlayer.playerID) {
                        totalPlayers[i].totalSeasonScore += curPlayer.actualScore;
                    }
                }
            } else {
                let seasonPlayer = {
                    firstName: curPlayer.firstName,
                    lastName: curPlayer.lastName,
                    playerId: curPlayer.playerID,
                    position: curPlayer.position,
                    realteamID: curPlayer.realTeamID,
                    totalSeasonScore: parseFloat(curPlayer.actualScore)
                }
                totalPlayers.push(seasonPlayer);
                highestScoring = seasonPlayer;
            }
        }
    }
    for (q in totalPlayers) {
        if (totalPlayers[q].totalSeasonScore > highestScoring.totalSeasonScore) {
            highestScoring = totalPlayers[q];
        }
    }
    highestScoring.totalSeasonScore = Math.round(highestScoring.totalSeasonScore * 10) / 10;
    return highestScoring;
}

function inMVPArray(ID, myArr) {
    for (element in myArr) {
        if (myArr[element].playerId == ID) {

            return true;
        }
    }

    return false;
}


function getWVP(leagueMember) {
    var totalPlayers = [];
    var lowestScoring;
    //console.log("ran");
    //console.log(leagueMember);
    for (x in leagueMember.pastWeeks) {
        for (y in leagueMember.pastWeeks[x].activePlayers) {
            let curPlayer = leagueMember.pastWeeks[x].activePlayers[y];
            if (inMVPArray(curPlayer.playerID, totalPlayers) == true) {
                for (i in totalPlayers) {
                    if (totalPlayers[i].playerId == curPlayer.playerID) {
                        totalPlayers[i].totalSeasonScore += curPlayer.actualScore;
                    }
                }
            } else {
                let seasonPlayer = {
                    firstName: curPlayer.firstName,
                    lastName: curPlayer.lastName,
                    playerId: curPlayer.playerID,
                    position: curPlayer.position,
                    realteamID: curPlayer.realTeamID,
                    totalSeasonScore: parseFloat(curPlayer.actualScore)
                }
                totalPlayers.push(seasonPlayer);
                lowestScoring = seasonPlayer;
            }
        }
    }
    for (q in totalPlayers) {
        if (totalPlayers[q].totalSeasonScore < lowestScoring.totalSeasonScore) {
            lowestScoring = totalPlayers[q];
        }
    }
    lowestScoring.totalSeasonScore = Math.round(lowestScoring.totalSeasonScore * 10) / 10;
    return lowestScoring;
}

function getWVPWeek(leagueMember) {
    var lowestScoring = leagueMember.pastWeeks[0].activePlayers[0];
    lowestScoring.week = 1;

    for (var x in leagueMember.pastWeeks) {
        for (var y in leagueMember.pastWeeks[x].activePlayers) {
            if (leagueMember.pastWeeks[x].activePlayers[y].actualScore < lowestScoring.actualScore) {
                //console.log(leagueMember.pastWeeks[x].activePlayers[y]);
                lowestScoring = leagueMember.pastWeeks[x].activePlayers[y];
                //console.log(x);
                lowestScoring.week = parseInt(x) + 1;
                //console.log(lowestScoring.week);

            }
        }
    }

    return lowestScoring;
}




function getStandardDeviation(member) {
    var dev = math.std(getWeekArray(member.pastWeeks));
    dev = Math.round(dev * 10) / 10;
    return dev;
}

function getLeagueStandardDeviation(league) {
    var members = league.members;
    var memberSTDTotal = 0;
    for (var i = 0; i < members.length; i++) {
        members[i].stdDev = getStandardDeviation(league.members[i])
        memberSTDTotal += members[i].stdDev;
    }
    dev = Math.round((memberSTDTotal / members.length) * 10) / 10;
    return dev;
}

function getWeekArray(memberPastWeeks) {
    var weeks = [];
    for (x in memberPastWeeks) {
        weeks.push(parseFloat(memberPastWeeks[x].activeScore));
    }
    return weeks;
}

function getStandardDeviationFinish(league, member) {
    var greaterCount = 1;
    member.stdDev = getStandardDeviation(member);
    for (var i = 0; i < league.members.length; i++) {
        if (member.stdDev > getStandardDeviation(league.members[i])) {
            greaterCount += 1;
        }
    }

    return greaterCount;

}

function getPPDifferenceFinish(league, member) {
    var greaterCount = 1;
    for (var i = 0; i < league.members.length; i++) {
        if ((getPotentialPoints(member) - member.completeSeasonPoints) > (getPotentialPoints(league.members[i]) - league.members[i].completeSeasonPoints)) {
            greaterCount += 1;
        }
    }
    return greaterCount;
}

function getPPFinish(league, member) {
    var greaterCount = 1;
    for (var i = 0; i < league.members.length; i++) {
        if (getPotentialPoints(member) < getPotentialPoints(league.members[i])) {
            greaterCount += 1;
        }
    }
    return greaterCount;
}

function getPPDifferenceFinishLeague(league) {
    var ppDifTotal = 0;
    for (var i = 0; i < league.members.length; i++) {
        let diff = getPotentialPoints(league.members[i]) - league.members[i].completeSeasonPoints;
        ppDifTotal += diff;
    }
    ppDifTotal = Math.round((ppDifTotal / league.members.length) * 10) / 10;
    return ppDifTotal;
}

function getBestWeek(member) {
    var curHighWeekScore = 0;
    var curHighWeek = member.pastWeeks[0];
    for (var i = 0; i < member.pastWeeks.length; i++) {
        if (member.pastWeeks[i].activeScore > curHighWeekScore) {
            curHighWeek = member.pastWeeks[i];
            curHighWeekScore = curHighWeek.activeScore;
        }
    }

    return curHighWeek;

}

function getBestWeekFinish(league, member) {
    // var curHighWeekScore = 0;
    // var curHighWeek;
    // for (var i = 0; i < member.pastWeeks.length; i++) {
    //     if (member.pastWeeks[i].activeScore > curHighWeekScore) {
    //         curHighWeek = member.pastWeeks[i];
    //         var curHighWeekScore = curHighWeek.activeScore;
    //     }
    // }

    // var greaterCount = 1;
    // for (var i = 0; i < league.members.length; i++) {
    //     for (var q = 0; q < league.members[i].pastWeeks.length; q++) {
    //         if (league.members[i].pastWeeks[q].activeScore > curHighWeek.activeScore) {
    //             greaterCount += 1;
    //         }
    //     }
    // }
    // return greaterCount;
    var bestWeeks = [];
    var memberBest = getBestWeek(member);
    var count = 1;
    for (var i = 0; i < league.members.length; i++) {
        bestWeeks.push(getBestWeek(league.members[i]));
    }
    for (var i = 0; i < bestWeeks.length; i++) {
        if (memberBest.activeScore < bestWeeks[i].activeScore) {
            count += 1;
        }
    }

    return count;

}

function getWorstWeekFinish(league, member) {
    // var curHighWeekScore = 0;
    // var curHighWeek;
    // for (var i = 0; i < member.pastWeeks.length; i++) {
    //     if (member.pastWeeks[i].activeScore > curHighWeekScore) {
    //         curHighWeek = member.pastWeeks[i];
    //         var curHighWeekScore = curHighWeek.activeScore;
    //     }
    // }

    // var greaterCount = 1;
    // for (var i = 0; i < league.members.length; i++) {
    //     for (var q = 0; q < league.members[i].pastWeeks.length; q++) {
    //         if (league.members[i].pastWeeks[q].activeScore > curHighWeek.activeScore) {
    //             greaterCount += 1;
    //         }
    //     }
    // }
    // return greaterCount;
    var worstWeeks = [];
    var memberWorst = getWorstWeek(member);
    var count = 1;
    for (var i = 0; i < league.members.length; i++) {
        worstWeeks.push(getWorstWeek(league.members[i]));
    }
    for (var i = 0; i < worstWeeks.length; i++) {
        if (memberWorst.activeScore > worstWeeks[i].activeScore) {
            count += 1;
        }
    }

    return count;

}


function getTotalWeeks(myYear) {
    var totalWeeks = 0;
    for (i = 0; i < myYear.members.length; i++) {
        totalWeeks += myYear.members[i].pastWeeks.length;
    }

    return totalWeeks;
}

function getWorstWeek(member) {
    var curLowWeekScore = member.pastWeeks[0].activeScore;
    var curLowWeek = member.pastWeeks[0];
    for (var i = 0; i < member.pastWeeks.length; i++) {
        if (member.pastWeeks[i].activeScore < curLowWeekScore) {
            curLowWeekScore = member.pastWeeks[i].activeScore;
            curLowWeek = member.pastWeeks[i];
        }
    }
    return curLowWeek;

}
/*
function getWorstWeekFinish(league, member) {
    var curLowWeekScore = member.pastWeeks[0].activeScore;
    var curLowWeek = member.pastWeeks[0];
    for (var i = 0; i < member.pastWeeks.length; i++) {
        if (member.pastWeeks[i].activeScore < curLowWeekScore) {
            curLowWeek = member.pastWeeks[i];
            curLowWeekScore = curLowWeek.activeScore;
        }
    }

    var greaterCount = 1;
    for (var i = 0; i < league.members.length; i++) {
        for (var q = 0; q < league.members[i].pastWeeks.length; q++) {
            if (league.members[i].pastWeeks[q].activeScore < curLowWeek.activeScore) {
                greaterCount += 1;
            }
        }
    }
    return greaterCount;

}
*/
function getRealTeamInitials(realteamID) {
    var team;
    //console.log(realteamID);
    switch (realteamID) {
        case 1:
            team = "Atl";
            break;
        case 2:
            team = "Buf";
            break;
        case 3:
            team = "Chi";
            break;
        case 4:
            team = "Cin";
            break;
        case 5:
            team = "Cle";
            break;
        case 6:
            team = "Dal";
            break;
        case 7:
            team = "Den";
            break;
        case 8:
            team = "Det";
            break;
        case 9:
            team = "GB";
            break;
        case 10:
            team = "Ten";
            break;
        case 11:
            team = "Ind";
            break;
        case 12:
            team = "KC";
            break;
        case 13:
            team = "Oak";
            break;
        case 14:
            team = "Lar";
            break;
        case 15:
            team = "Mia";
            break;
        case 16:
            team = "Min";
            break;
        case 17:
            team = "NE";
            break;
        case 18:
            team = "NO";
            break;
        case 19:
            team = "NYG";
            break;
        case 20:
            team = "NYJ";
            break;
        case 21:
            team = "Phi";
            break;
        case 22:
            team = "Ari";
            break;
        case 23:
            team = "Pit";
            break;
        case 24:
            team = "LAC";
            break;
        case 25:
            team = "SF";
            break;
        case 26:
            team = "Sea";
            break;
        case 27:
            team = "TB";
            break;
        case 28:
            team = "Was";
            break;
        case 29:
            team = "Car";
            break;
        case 30:
            team = "Jax";
            break;
        case 33:
            team = "Bal";
            break;
        case 34:
            team = "Hou";
            break;
    }
    //console.log(team);
    return team;
}

function getColor(value) {
    //value from 0 to 1
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}

function getCardColor(rank, outOf) {
    return getColor(rank / outOf);
}

function getInverseCardColor(rank, outOf) {
    return getColor((1 + (outOf - rank)) / outOf);
}

function getTextColor(rank, outOf) {
    /*
    hsl = hsl.slice(4, hsl.length-1);
    hsl = hsl.split(',');
    hsl[1] = hsl[1].slice(0, hsl.length-  1);
    hsl[2] = hsl[2].slice(0, hsl.length-  1);
    var rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
    console.log(hsl);
    console.log(rgb);
    var o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) /1000);
    
    if(o > 125) {
        return 'black';
    }else{ 
        return 'white';
    }
    
    */
    var o = rank / outOf;
    if (o < .75) {
        return 'black';
    } else {
        return 'white';
    }
}

function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function roundToHundred(x){
    return Math.round(x * 100) / 100
}

function roundToTen(x){
    return Math.round(x * 10) / 10;
}

function getLeagueWeeklyAverage(members) {
    memberPF = 0;
    for (i = 0; i < members.length; i++){
        memberPF += members[i].completeSeasonPoints;
    }
    memberPF = memberPF / members.length;
    memberPF = memberPF/members[0].pastWeeks.length;
    return memberPF;
}