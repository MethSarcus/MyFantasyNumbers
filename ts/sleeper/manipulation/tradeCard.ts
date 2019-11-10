function createTradeCard(league: SleeperLeague, trade: SleeperTrade) {
    const tradeContainer = document.createElement("div");
    tradeContainer.id = "trade_container_" + trade.transactionId;
    tradeContainer.classList.add("row", "my-1");
    const template = document.querySelector("template");
    trade.consentingTeamIds.forEach((teamID) => {
        const teamNode = document.importNode(template.content, true);
        const ownerName = teamNode.querySelector(".trade_owner_name");
        const sentAssetsList = teamNode.querySelector(".sent_assets_list");
        const receivedAssetsList = teamNode.querySelector(".received_assets_list");
        ownerName.textContent = league.getMember(teamID).ownerToString();
        trade.playersTraded.get(teamID).forEach((player) => {
            sentAssetsList.innerHTML += "&bull;" + player.firstName + " " + player.lastName;
            sentAssetsList.appendChild(document.createElement("br"));
        });
        trade.playersReceived.get(teamID).forEach((player) => {
            receivedAssetsList.innerHTML += "&bull;" + player.firstName + " " + player.lastName;
            receivedAssetsList.appendChild(document.createElement("br"));
        });
        trade.draftPicksInvolved.filter((pick) => {
            return teamID === pick.currentOwnerId;
        }).forEach((pick) => {
            receivedAssetsList.innerHTML += pick.toString(league);
            receivedAssetsList.appendChild(document.createElement("br"));

        });

        trade.draftPicksInvolved.filter((pick) => {
            return teamID === pick.sellingOwnerId;
        }).forEach((pick) => {
            sentAssetsList.innerHTML += pick.toString(league);
            sentAssetsList.appendChild(document.createElement("br"));

        });
        tradeContainer.appendChild(teamNode);
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
