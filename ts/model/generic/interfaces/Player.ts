interface Player {
    firstName: string;
    lastName: string;
    eligibleSlots: number[];
    score: number;
    projectedScore: number;
    position: string;
    realTeamID: string;
    espnID: string;
    weekNumber: number;
    lineupSlotID: number;
    playerID: string;

    isEligible: (slot: number) => boolean;
}
