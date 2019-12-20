function transitionToLeaguePage() {
    const particles = document.getElementById("particles-js");
    particles.style.display = "none";
    updateLoadingText("Finished");
    $("#prompt_screen").stop(true, true).fadeOut(200, () => {
        unfadeLeaguePage();
    });
}

function fadeTeam(league: League, teamID: number) {
    $("#teamPill").stop(true, true).fadeOut(200, () => {
        updateTeamPill(league, teamID);
    });
}

function fadeTeamWithLogic(league: League, teamID: number) {
    if (document.getElementById(teamID + "_link").classList[1] !== "active") {
        $("#teamPill").stop(true, true).fadeOut(200, () => {
            updateTeamPill(league, teamID);
        });
    }
}

function fadeToLeaguePage() {
    $("#teamPill").stop(true, true).fadeOut(200);
}

function unfadeTeam() {
    $("#teamPill").stop(true, true).fadeIn(200);
}

function unfadeLeaguePage() {
    document.getElementById("page_header").style.display = "flex";
    document.getElementById("page_container").style.display = "inline-block";
}
