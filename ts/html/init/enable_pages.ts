function enableTradePage(): void {
    document.getElementById("trades_button").style.display = "block";
    document.getElementById("trades_button").onclick = () => {
        $(".nav-link").removeClass("active");
        fadeToLeaguePage();
    };
}