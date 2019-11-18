function createTradeCard(league: SleeperLeague, trade: SleeperTrade) {
    const tradeContainer = document.createElement("div");
    tradeContainer.id = "trade_container_" + trade.transactionId;
    tradeContainer.classList.add("row", "my-1", "league_trade", "card-deck");
    const template = document.getElementsByTagName("template")[0];
    trade.consentingTeamIds.forEach((teamID, index) => {
        const teamNode = document.importNode(template.content, true);
        const ownerName = teamNode.querySelector(".trade_owner_name") as HTMLDivElement;
        const container = teamNode.querySelector(".league_trade_container") as HTMLDivElement;
        const sentAssetsList = teamNode.querySelector(".sent_assets_list");
        const receivedAssetsList = teamNode.querySelector(".received_assets_list");
        const c = document.createElement("img");
        container.style.borderColor = getMemberColor(teamID);
        c.src = league.getMember(teamID).logoURL;
        c.style.width = "25px";
        c.style.height = "25px";
        c.style.borderRadius = "25px";
        c.addEventListener("error", fixNoImage);
        c.style.marginLeft = "8px";
        c.style.marginRight = "auto";
        ownerName.appendChild(c);
        ownerName.appendChild(document.createTextNode(" " + league.getMember(teamID).ownerToString()));
        trade.playersTraded.get(teamID).forEach((player) => {
            sentAssetsList.innerHTML += "- " + player.firstName + " " + player.lastName;
            sentAssetsList.appendChild(document.createElement("br"));
        });
        trade.playersReceived.get(teamID).forEach((player) => {
            receivedAssetsList.innerHTML += "+ " + player.firstName + " " + player.lastName;
            receivedAssetsList.appendChild(document.createElement("br"));
        });
        trade.draftPicksInvolved.filter((pick) => {
            return teamID === pick.currentOwnerId;
        }).forEach((pick) => {
            receivedAssetsList.innerHTML += "+ " + pick.toString(league);
            receivedAssetsList.appendChild(document.createElement("br"));
        });

        trade.draftPicksInvolved.filter((pick) => {
            return teamID === pick.sellingOwnerId;
        }).forEach((pick) => {
            sentAssetsList.innerHTML += "- " + pick.toString(league);
            sentAssetsList.appendChild(document.createElement("br"));

        });

        if (trade.faabTraded.get(teamID) !== undefined && trade.faabTraded.get(teamID) !== 0) {
            if (trade.faabTraded.get(teamID) > 0) {
                receivedAssetsList.appendChild(document.createTextNode("Faab: + $" + trade.faabTraded.get(teamID)));
            } else {
                sentAssetsList.appendChild(document.createTextNode("Faab: - $" + (trade.faabTraded.get(teamID) * -1)));
            }
        }

        tradeContainer.appendChild(teamNode);
        // if (index < trade.consentingTeamIds.length - 1) {
        //     const tradeSymbolContainer = document.createElement("div");
        //     tradeSymbolContainer.classList.add("col-1", "my-auto", "ml-0");
        //     const tradeSymbol = document.createElement("img");
        //     tradeSymbol.src = "./assets/images/trade_symbol.png";
        //     tradeSymbol.style.height = "2em";
        //     tradeSymbol.style.width = "3em";
        //     tradeSymbolContainer.appendChild(tradeSymbol);
        //     tradeContainer.appendChild(tradeSymbolContainer);
        // }
    });
    return tradeContainer;
}

function constructTrades(league: SleeperLeague): void {
    const container = document.getElementById("league_trades_container");
    league.trades.forEach((trade) => {
        const tradeRow = document.createElement("div");
        tradeRow.appendChild(createTradeCard(league, trade));
        container.appendChild(tradeRow);
    });
}

function constructTeamPageTrades(league: SleeperLeague, teamId: number): void {
    const container = document.getElementById("team_page_trades_container");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    league.trades.filter((trade) => {
        return trade.consentingTeamIds.includes(teamId);
    }).forEach((trade) => {
        const tradeRow = document.createElement("div");
        tradeRow.appendChild(createTradeCard(league, trade));
        container.appendChild(tradeRow);
    });
}
