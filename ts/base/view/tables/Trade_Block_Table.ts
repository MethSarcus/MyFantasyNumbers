function generateTradeBlock(league: SleeperLeague): void {
    const row = document.getElementById("trade_block_row");
    league.members.forEach((member) => {
        if (member.tradingBlock.length > 0) {
            row.appendChild(createTradeBlockCardContainer(member));
        }
    });
}

function createTradeBlockCardContainer(member: SleeperMember) {
    const card = document.createElement("div");
    card.style.maxHeight = "20em";
    card.style.overflowY = "scroll";
    card.classList.add("card", "trade-block-card", "col-3", "p-3");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    const cardHeader = document.createElement("h5");
    cardHeader.classList.add("card-title");
    card.appendChild(cardBody);
    cardBody.appendChild(cardHeader);
    cardHeader.innerText = member.teamNameToString();
    cardBody.appendChild(createTradeBlockTable(member));
    return card;
}

function createTradeBlockTable(member: SleeperMember): HTMLTableElement {
    const table = document.createElement("table");
    table.classList.add("table", "table-hover", "table-sm", "trade-block-table");
    member.tradingBlock.forEach((player) => {
        const playRow = document.createElement("tr");
        const playerBadge = generateBenchPositionBadge(player.position);
        playerBadge.style.verticalAlign = "center";
        playRow.appendChild(playerBadge);
        playRow.appendChild(generateGenericPlayerCell(player));
        table.appendChild(playRow);
    });

    return table;
}
