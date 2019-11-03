interface SleeperTransactionResponse {
    waiver_budget: FaabTransaction[];
    type: string;
    transaction_id: string;
    status_updated: number;
    status: string;
    settings?: any;
    roster_ids: number[];
    metadata?: {notes: TransactionMetadata};
    leg: number;
    drops?: TradeAddDropKey;
    draft_picks: SleeperDraftPickResponse[];
    creator: string;
    created: number;
    consenter_ids: number[];
    adds?: TradeAddDropKey;
}

interface SleeperDraftPickResponse {
    season: string;
    round: number;
    roster_id: number;
    previous_owner_id: number;
    owner_id: number;
    league_id?: any;
}

interface TradeAddDropKey {
    [key: string]: number;
}

interface FaabTransaction {
    sender: number;
    receiver: number;
    amount: number;
}
enum TransactionMetadata {
    SUCCESS_PLAYER_CLAIMED = "Your waiver claim was processed successfully!",
    FAILED_CLAIMED_BY_OTHER_OWNER = "This player was claimed by another owner.",
    FAILED_TOO_MANY_PLAYERS = "Unfortunately, your roster will have too many players after this transaction.",
}
