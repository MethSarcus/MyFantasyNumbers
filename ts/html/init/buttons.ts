function enableButtons(): void {
    document.getElementById("league_name_header").onclick = () => {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
    document.getElementById("pwrRankButton").onclick = () => {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };

    document.getElementById("stats_button").onclick = () => {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
}
