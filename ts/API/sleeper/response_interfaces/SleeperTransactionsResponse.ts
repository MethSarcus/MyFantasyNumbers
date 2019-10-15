interface WaiverBudget {
    sender: number;
    receiver: number;
    amount: number;
}

interface Transaction {
    playerID: string;
    teamID: string;
}

interface SleeperTransactionDrops { [playerID: string]: Transaction; }
interface SleeperTransactionAdds { [playerID: string]: Transaction; }

interface Settings {
    waiver_bid: number;
    seq: number;
    priority?: number;
}

interface Metadata {
    notes: string;
}

interface SleeperDraftPickTradeResponse {
    season: string;
    round: number;
    roster_id: number;
    previous_owner_id: number;
    owner_id: number;
    league_id?: any;
}

interface SleeperDraftPickTradeResponse {
    waiver_budget: WaiverBudget[];
    type: string;
    transaction_id: string;
    status_updated: any;
    status: string;
    settings: Settings;
    roster_ids: number[];
    metadata: Metadata;
    leg: number;
    drops: SleeperTransactionDrops;
    draft_picks: SleeperDraftPickTradeResponse[];
    creator: string;
    created: any;
    consenter_ids: number[];
    adds: SleeperTransactionAdds;
}
