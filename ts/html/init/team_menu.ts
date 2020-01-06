function createTeamMenu(league: League): void {
    const tabsList = document.getElementById("tabs-content");
    const nav = document.getElementById("team_dropdown");
    const q = document.getElementById("leaguePage");
    tabsList.appendChild(q);
    for (const i in league.members) {
        const a = document.createElement("li");
        a.id = league.members[i].teamID.toString();
        a.classList.add("align-items-left", "side-item", "justify-content-center");
        a.onclick = function() {
            $(".nav-link").removeClass("active");
            fadeTeamWithLogic(league, parseInt((this as any).id, 10));
        };
        const b = document.createElement("a");
        b.id = league.members[i].teamID + "_link";
        b.setAttribute("data-toggle", "pill");
        b.href = "#teamPill";
        b.classList.add("nav-link", "team-menu-link");
        b.style.paddingLeft = "3px;";
        const c = document.createElement("img");
        c.src = league.members[i].logoURL;
        c.style.width = "25px";
        c.style.height = "25px";
        c.style.borderRadius = "25px";
        c.addEventListener("error", fixNoImage);
        c.style.marginLeft = "8px";
        c.style.marginRight = "auto";
        b.appendChild(c);
        const d = document.createTextNode(" " + league.members[i].teamNameToString());
        b.appendChild(d);
        a.appendChild(b);
        nav.appendChild(a);
    }
}
