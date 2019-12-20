class SleeperMember implements Member {
    public memberID: string;
    public name: string;
    public teamName: string;
    public teamAbbrev: string;
    public teamID: number;
    public logoURL: string;
    public stats: Stats;
    public division: string;
    public currentRoster: SleeperBasePlayer[] = [];
    public currentRosterIDs: string[] = [];
    public rosterNicknameMap: Map<string, string> = new Map<string, string>();
    public tradingBlock: SleeperBasePlayer[] = [];
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
            this.logoURL = "./assets/images/user1.png";
        }
    }

    public getPictureURL(): string {
        return this.logoURL;
    }

    public setAdvancedStats(weeks: Week[]): void {
        const scores: number[] = [];
        weeks.forEach((week) => {
            scores.push(week.getTeam(this.teamID).score);
        });

        this.stats.standardDeviation = calcStandardDeviation(scores);
        this.stats.weeklyAverage = getMean(scores);
    }

    public setNicknames(): void {
        this.rosterNicknameMap.forEach((value, key) => {
            if (value !== "allow_pn_scoring" && value !== "allow_pn_news") {
                const playerId = key.replace("p_nick_", "");
                this.currentRoster.forEach((player) => {
                    if (player.playerID === playerId) {
                        player.nickName = value;
                        if (value.toLowerCase().includes("otb") || value.toLowerCase().includes("on the block")) {
                            this.tradingBlock.push(player);
                        }
                    }
                });
            }
        });
    }

    public setRosterAttributes(lib: SleeperPlayerLibrary): void {
        if (this.currentRosterIDs) {
            this.currentRosterIDs.forEach((id) => {
                if (id !== null) {
                    this.currentRoster.push(new SleeperBasePlayer(lib[id]));
                }
            });
            this.setNicknames();
        }
    }

    public teamNameToString(): string {
        if (this.teamName === "" || this.teamName === undefined) {
            return this.ownerToString();
        } else {
            return this.teamName;
        }
    }

    public ownerToString(): string {
        return this.name;
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
