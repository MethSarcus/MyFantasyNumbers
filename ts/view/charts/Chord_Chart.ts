declare var am4core: any;
declare var am4charts: any;
declare var am4themes_animated: any;

function createLeagueTradeDiagram(league: League): void {
    am4core.useTheme(am4themes_animated);
    // const chart = am4core.create("league_trade_chart", am4charts.ChordDiagram);
    // chart.data = createLeagueTradeDiagramData(league);
    // chart.dataFields.fromName = "from";
    // chart.dataFields.toName = "to";
    // chart.dataFields.value = "value";
    // chart.dataFields.color = "nodeColor";
    const leagueTradeData = createLeagueTradeDiagramData(league);
    console.log(leagueTradeData);
    am4core.createFromConfig({
        "data": leagueTradeData,
        "dataFields": {
          "fromName": "from",
          "toName": "to",
          "value": "value",
          "nodeColor": "nodeColor"
        }
      }, "league_trade_chart", am4charts.ChordDiagram);
}

function createLeagueTradeDiagramData(league: League): object[] {
    const tradeMap = new Map<string, number>();
    const tradeList: object[] = [];
    league.trades.forEach((trade) => {
        const initId = trade.initiatingTeamId;
        const consentingTeamIds = trade.consentingTeamIds.slice(1, trade.consentingTeamIds.length);
        consentingTeamIds.forEach((partnerId) => {
            const tradeMapKey = initId + "," + partnerId;
            const tradeMapAltKey = partnerId + "," + initId;
            if (tradeMap.has(tradeMapKey)) {
                tradeMap.set(tradeMapKey, tradeMap.get(tradeMapKey) + 1);
            } else if (tradeMap.has(tradeMapAltKey)) {
                tradeMap.set(tradeMapAltKey, tradeMap.get(tradeMapAltKey) + 1);
            } else {
                tradeMap.set(tradeMapKey, 1);
            }
        });
    });
    tradeMap.forEach((value, key) => {
        tradeList.push(formatTradeValues(league, key, value));
    });

    return tradeList;
}

function formatTradeValues(league: League, key: string, numTrades: number ): object {
    const names = key.split(",");
    const team1 = parseInt(names[0]);
    const team2 = parseInt(names[1]);
    const formattedData = {
        "from": league.getMember(team1).nameToString(),
        "to": league.getMember(team2).nameToString(),
        "value": numTrades,
        "nodeColor": getMemberColor(team1)
    };

    return formattedData;
}
