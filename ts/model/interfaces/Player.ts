interface Player {
    firstName: string;
    lastName: string;
    eligibleSlots: any;
    score: any;
    projectedScore: any;
    position: any;
    realTeamID: any;
    playerID: any;
    weekNumber: any;
    lineupSlotID: any;

    isEligible: (slot: number) => boolean;
}
