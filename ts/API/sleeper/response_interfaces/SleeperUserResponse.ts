interface SleeperUserMetadata {
    mention_pn: string;
    allow_pn: string;
    user_message_pn: string;
    transaction_waiver: string;
    transaction_trade: string;
    transaction_free_agent: string;
    transaction_commissioner: string;
    team_name_update: string;
    team_name: string;
    player_nickname_update: string;
}

interface SleeperUserResponse {
    user_id: string;
    settings?: any;
    metadata: SleeperUserMetadata;
    league_id: string;
    is_owner?: boolean;
    is_bot: boolean;
    display_name: string;
    avatar: string;
}
