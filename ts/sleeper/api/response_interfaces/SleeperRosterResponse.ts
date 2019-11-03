interface SleeperRosterSettings {
    wins: number;
    waiver_position: number;
    waiver_budget_used: number;
    total_moves: number;
    ties: number;
    ppts_decimal: number;
    ppts: number;
    losses: number;
    fpts_decimal: number;
    fpts_against_decimal: number;
    fpts_against: number;
    fpts: number;
    division: number;
}

interface SleeperRosterResponse {
    taxi: string[];
    starters: string[];
    settings: SleeperRosterSettings;
    roster_id: string;
    reserve: string[];
    players: string[];
    player_map?: any;
    owner_id: string;
    metadata: any;
    league_id: string;
    co_owners: string[];
}
