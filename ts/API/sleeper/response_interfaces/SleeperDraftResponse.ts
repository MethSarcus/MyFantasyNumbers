
interface SleeperDraftPickMetadata {
    years_exp: string;
    team: string;
    status: string;
    sport: string;
    position: string;
    player_id: string;
    number: string;
    news_updated: string;
    last_name: string;
    injury_status: string;
    first_name: string;
}

interface SleeperDraftPickResponse {
    round: number;
    roster_id: number;
    player_id: string;
    picked_by: string;
    pick_no: number;
    metadata: SleeperDraftPickMetadata;
    is_keeper?: any;
    draft_slot: number;
    draft_id: string;
}
