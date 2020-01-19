function generatePositionBadge(marginText: number, slotID: number): HTMLTableDataCellElement {
    const td = document.createElement("td");
    td.style.textAlign = "center";
    const container = document.createElement("div");
    container.style.backgroundColor = getMemberColor(slotID);
    container.style.color = "white";
    container.classList.add("position_badge");
    const posText = document.createElement("b");
    posText.style.fontSize = "1em";
    posText.innerText = intToPosition.get(slotID);
    const margin = document.createElement("small");
    margin.classList.add("margin_small_text");
    if (marginText > 0) {
        margin.innerText = "+" + roundToHundred(marginText).toString();
        margin.style.color = "#00ff00";
    } else {
        margin.innerText = roundToHundred(marginText).toString();
        margin.style.color = "#ff0000";
    }
    container.appendChild(posText);
    td.appendChild(container);
    td.appendChild(margin);

    return td;
}

function generateBenchPositionBadge(slot: number) {
    const td = document.createElement("td");
    td.style.textAlign = "center";
    const container = document.createElement("div");
    container.style.backgroundColor = getMemberColor(slot);
    container.style.color = "white";
    container.classList.add("bench_position_badge");
    const posText = document.createElement("b");
    posText.style.fontSize = "1em";
    posText.innerText = intToPosition.get(slot);
    container.appendChild(posText);
    td.appendChild(container);

    return td;
}

function enableBadgesPane(): void {
    document.getElementById("stats_button").style.display = "block";
    document.getElementById("stats_button").onclick = () => {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
}
