declare var am4core: any;
declare var am4charts: any;
declare var am4themes_animated: any;

function createLeagueTradeDiagram(league: SleeperLeague): void {
    am4core.useTheme(am4themes_animated);
    const leagueTradeData = createLeagueTradeDiagramData(league);
    initChordChart(leagueTradeData);
}



function createLeagueTradeDiagramData(league: SleeperLeague): object[] {
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

function formatTradeValues(league: League, key: string, numTrades: number): object {
    const names = key.split(",");
    const team1 = parseInt(names[0]);
    const team2 = parseInt(names[1]);
    const formattedData = {
        from: league.getMember(team1).teamNameToString(),
        to: league.getMember(team2).teamNameToString(),
        value: numTrades,
        nodeColor: getMemberColor(team1)
    };

    return formattedData;
}

function initChordChart(chartData: object[]) {
    am4core.useTheme(am4themes_animated);
    const chart = am4core.create("league_trade_chart", am4charts.ChordDiagram);

    chart.colors.saturation = 0.45;
    chart.data = chartData;

    chart.dataFields.fromName = "from";
    chart.dataFields.toName = "to";
    chart.dataFields.value = "value";
    chart.dataFields.nodeColor = "nodeColor";

    chart.nodePadding = 0.5;
    chart.minNodeSize = 0.01;
    chart.startAngle = 80;
    chart.endAngle = chart.startAngle + 360;
    chart.sortBy = "value";

    const nodeTemplate = chart.nodes.template;
    nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.propertyFields.fill = "color";
    nodeTemplate.tooltipText = "{name}'s trades: {total}";

    // when rolled over the node, make all the links rolled-over
    nodeTemplate.events.on("over", (event: any) => {
        const node = event.target;
        node.outgoingDataItems.each((dataItem: any) => {
            if (dataItem.toNode) {
                dataItem.link.isHover = true;
                dataItem.toNode.label.isHover = true;
            }
        });
        node.incomingDataItems.each((dataItem: any) => {
            if (dataItem.fromNode) {
                dataItem.link.isHover = true;
                dataItem.fromNode.label.isHover = true;
            }
        });

        node.label.isHover = true;
    });

    // when rolled out from the node, make all the links rolled-out
    nodeTemplate.events.on("out", (event: any) => {
        const node = event.target;
        node.outgoingDataItems.each((dataItem: any) => {
            if (dataItem.toNode) {
                dataItem.link.isHover = false;
                dataItem.toNode.label.isHover = false;
            }
        });
        node.incomingDataItems.each((dataItem: any) => {
            if (dataItem.fromNode) {
                dataItem.link.isHover = false;
                dataItem.fromNode.label.isHover = false;
            }
        });

        node.label.isHover = false;
    });

    const label = nodeTemplate.label;
    label.relativeRotation = 90;

    label.fillOpacity = 0.25;
    const labelHS = label.states.create("hover");
    labelHS.properties.fillOpacity = 1;

    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    // this adapter makes non-main character nodes to be filled with color of the main character which he/she kissed most

    // link template
    const linkTemplate = chart.links.template;
    linkTemplate.strokeOpacity = 0;
    linkTemplate.fillOpacity = 0.1;
    linkTemplate.tooltipText = "{fromName} & {toName}:{value.value}";

    const hoverState = linkTemplate.states.create("hover");
    hoverState.properties.fillOpacity = 0.7;
    hoverState.properties.strokeOpacity = 0.7;
}
