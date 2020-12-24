function enableSeasonPortionSelector(league: League, isPlayoffs: boolean): void {
    if (!isPlayoffs) {
        document.getElementById(SEASON_PORTION.ALL).classList.add("disabled");
        document.getElementById(SEASON_PORTION.POST).classList.add("disabled");
        document.getElementById(SEASON_PORTION.ALL).classList.remove("active");
        document.getElementById(SEASON_PORTION.REGULAR).classList.add("active");
        (document.getElementById("post_radio_button") as HTMLButtonElement).disabled = true;
        (document.getElementById("complete_radio_button") as HTMLButtonElement).disabled = true;
    } else if (league.settings.seasonDuration.regularSeasonLength === 0) {
        document.getElementById(SEASON_PORTION.ALL).classList.add("disabled");
        document.getElementById(SEASON_PORTION.REGULAR).classList.add("disabled");
        (document.getElementById("regular_radio_button") as HTMLButtonElement).disabled = true;
        (document.getElementById("complete_radio_button") as HTMLButtonElement).disabled = true;
        document.getElementById(SEASON_PORTION.ALL).classList.remove("active");
    } else {
        document.getElementById(SEASON_PORTION.ALL).onclick = () => {
            league.seasonPortion = SEASON_PORTION.ALL;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (let i = 1; i <= league.members.length; i++) {
                if ($("#" + i).find("a.active").length !== 0) {
                    fadeTeam(league, parseInt(i.toString(), 10));
                }
            }
            league.updateMainPage();
        };
        document.getElementById(SEASON_PORTION.REGULAR).onclick = () => {
            league.seasonPortion = SEASON_PORTION.REGULAR;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (let i = 1; i <= league.members.length; i++) {
                if ($("#" + i).find("a.active").length !== 0) {
                    fadeTeam(league, parseInt(i.toString(), 10));
                }
            }
            league.updateMainPage();
        };
        document.getElementById(SEASON_PORTION.POST).onclick = () => {
            league.seasonPortion = SEASON_PORTION.POST;
            league.resetStats();
            league.setMemberStats(league.getSeasonPortionWeeks());
            for (let i = 1; i <= league.members.length; i++) {
                if ($("#" + i).find("a.active").length !== 0) {
                    fadeTeam(league, parseInt(i.toString(), 10));
                }
            }
            league.updateMainPage();
        };
    }
}
