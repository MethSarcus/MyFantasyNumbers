class Member {
    public ID: number;
    public firstName: string;
    public lastName: string;
    public teamLocation: string;
    public teamNickname: string;
    public teamAbbrev: string;
    public division: string;
    public teamID: number;
    public logoURL: string;
    public transactions: any;
    public stats: Stats;
    constructor(memberID, firstName, lastName, teamLocation,
                teamNickname, teamAbbrev, division, teamID, logoURL, transactions, stats) {
        this.ID = memberID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.teamLocation = teamLocation;
        this.teamNickname = teamNickname;
        this.teamAbbrev = teamAbbrev;
        this.division = division;
        this.teamID = teamID;
        this.logoURL = logoURL;
        this.transactions = transactions;
        this.stats = stats;
    }

    public setAdvancedStats(weeks: Week[]): void {
        const scores = [];
        weeks.forEach((week) => {
            scores.push(week.getTeam(this.ID).score);
        });

        this.stats.standardDeviation = math.std(scores);
        this.stats.weeklyAverage = math.mean(scores);
    }
}
