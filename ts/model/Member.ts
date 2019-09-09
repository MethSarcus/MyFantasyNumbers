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
            scores.push(week.getTeam(this.teamID).score);
        });

        this.stats.standardDeviation = calcStandardDeviation(scores);
        this.stats.weeklyAverage = getMean(scores);
    }

    public nameToString(): string {
        return this.teamLocation + " " + this.teamNickname;
    }

    public ownerToString(): string {
        return this.firstName + " " + this.lastName;
    }

    public recordToString(): string {
        if (this.stats.ties != 0) {
            return this.stats.wins + "-" + this.stats.losses + "-" + this.stats.ties;
        } else {
            return this.stats.wins + "-" + this.stats.losses;
        }
    }

    public finishToString(): string {
        return ordinal_suffix_of(this.stats.finalStanding);
    }

    public powerRecordToString(): string {
        return this.stats.powerWins + "-" + this.stats.powerLosses;
    }

    public potentialPowerRecordToString(): string {
        return this.stats.potentialPowerWins + "-" + this.stats.potentialPowerLosses;
    }
}
