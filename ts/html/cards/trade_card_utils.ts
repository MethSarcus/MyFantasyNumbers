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
