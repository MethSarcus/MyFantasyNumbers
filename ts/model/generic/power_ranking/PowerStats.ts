class PowerStats {
    public wins: number;
    public losses: number;
    public ties: number;
    public pf: number;
    public projected: number;
    public pp: number;
    public teamID: number;
    public weekNumber: number;

    constructor(teamID, weekNumber, pf, pp, projected) {
        this.teamID = teamID;
        this.weekNumber = weekNumber;
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.pf = pf;
        this.projected = projected;
        this.pp = pp;
    }
}
