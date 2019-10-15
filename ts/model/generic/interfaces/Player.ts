interface Player {
    firstName: string;
    lastName: string;
    eligibleSlots: number[];
    score: number;
    projectedScore: number;
    position: string;
    realTeamID: number;
    playerID: string;
    weekNumber: number;
    lineupSlotID: number;

    isEligible: (slot: number) => boolean;
}
