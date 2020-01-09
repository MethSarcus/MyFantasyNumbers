function createPositionalCheckboxes(league: League) {
    const checkboxGroupContainer = document.getElementById("position_checkbox_container");
    league.settings.positions.forEach((position) => {
        checkboxGroupContainer.appendChild(createPositionCheckbox(position, league));
    })
}

function createPositionCheckbox(position: string, league: League): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add("form-check", "form-check-inline");
    
    const input = document.createElement("input");
    input.classList.add("form-check-input");
    input.type = "checkbox";
    input.id = position + "_toggle_checkbox";
    input.value = position;
    input.checked = true;
    input.onclick = () => {
            if (input.checked) {
                const index = league.settings.excludedPositions.indexOf(positionToInt.get(position));
                if (index > -1) {
                    league.settings.excludedPositions.splice(index, 1);
                }
        } else {
            league.settings.excludedPositions.push(positionToInt.get(position));
        }

        league.resetStats();
        league.setMemberStats(league.getSeasonPortionWeeks());
        league.updateMainPage();
    };

    const label = document.createElement("label");
    label.classList.add("form-check-label");
    (label as HTMLLabelElement).htmlFor = position;
    label.innerText = position;

    container.appendChild(input);
    container.appendChild(label);

    return container;
}