interface Team {
    lineup: Player[];
    bench: Player[];
    IR: Player[];
    teamID: number;
    score: number;
    potentialPoints: number;
    projectedScore: number;
    opponentID: number;
    gutDifference: number;
    gutPlayers: number;

    getOptimalLineup: (activeLineupSlots: number[]) => Player[];

    getTeamScore: (players: Player[]) => number;

    getProjectedScore: (players: Player[]) => number;

    getMVP: () => Player;

    getLVP: () => Player;

    getPositionalPlayers: (position: string) => Player[];

    getEligibleSlotPlayers: (slot: number) => Player[];

    getEligibleSlotBenchPlayers: (slot: number) => Player[];

    getProjectedOptimalLineup: (activeLineupSlots: number[]) => Player[];

    getGutPoints: (activeLineupSlots: number[]) => [number, number];

    getProjectedLinupPlayerDifference: (activeLineupSlots: number[]) => [Player[], Player[]];
}
