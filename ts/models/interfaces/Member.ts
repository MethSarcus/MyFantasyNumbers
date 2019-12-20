interface Member {
    memberID: string;
    teamAbbrev: string;
    division: string;
    teamID: number;
    logoURL: string;
    stats: Stats;

    setAdvancedStats: (weeks: Week[]) => void;
    teamNameToString: () => string;
    ownerToString: () => string;
    recordToString: () => string;
    rankToString: () => string;
    finishToString: () => string;
    powerRecordToString: () => string;
    potentialPowerRecordToString: () => string;
}
