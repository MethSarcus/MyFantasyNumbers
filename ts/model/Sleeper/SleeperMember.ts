class SleeperMember implements Member {
    public memberID: string;
    public name: string;
    public teamName: string;
    public teamAbbrev: string;
    public teamID: number;
    public logoURL: string;
    public stats: Stats;
    public division: string;
    constructor(memberID: string, memberName: string, teamName: string, teamAvatar: string) {
        this.memberID = memberID;
        this.name = memberName;
        this.teamName = teamName;
        if (teamName) {
            this.teamAbbrev = teamName.substring(0, 4);
        } else {
            this.teamAbbrev = memberName.substring(0, 4);
        }
        if (teamAvatar !== undefined && teamAvatar !== null) {
            this.logoURL = "https://sleepercdn.com/avatars/" + teamAvatar.toString();
        } else {
            this.logoURL = "../../../assets/user1.png";
        }
    }

    public getPictureURL(): string {
        return this.logoURL;
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
        return this.name;
    }

    public ownerToString(): string {
        return this.teamName;
    }

    public recordToString(): string {
        if (this.stats.ties !== 0) {
            return this.stats.wins + "-" + this.stats.losses + "-" + this.stats.ties;
        } else {
            return this.stats.wins + "-" + this.stats.losses;
        }
    }

    public rankToString(): string {
        return ordinal_suffix_of(this.stats.rank);
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
