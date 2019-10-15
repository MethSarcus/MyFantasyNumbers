interface Member {
    memberID: string;
    teamAbbrev: string;
    division: string;
    teamID: number;
    logoURL: string;
    stats: Stats;

    setAdvancedStats: (weeks: Week[]) => void;
    nameToString: () => string;
    ownerToString: () => string;
    recordToString: () => string;
    rankToString: () => string;
    finishToString: () => string;
    powerRecordToString: () => string;
    potentialPowerRecordToString: () => string;
}
