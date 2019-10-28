interface Player {
    firstName: string;
    lastName: string;
    eligibleSlots: number[];
    score: number;
    projectedScore: number;
    position: string;
    realTeamID: number;
    espnID: string;
    weekNumber: number;
    lineupSlotID: number;
    playerID: string;

    isEligible: (slot: number) => boolean;
}
