interface SleeperLeagueResponse {
    total_rosters: number;
    status: string;
    sport: string;
    shard: number;
    settings: Settings;
    season_type: string;
    season: string;
    scoring_settings: SleeperScoringSettingsResponse;
    roster_positions: string[];
    previous_league_id?: string;
    name: string;
    metadata: object[];
    loser_bracket_id?: string;
    league_id: string;
    last_read_id?: string;
    last_pinned_message_id?: string;
    last_message_time: number;
    last_message_text_map: Map<string, string>;
    last_message_text: string;
    last_message_id: string;
    last_message_attachment: SleeperLastMessageAttachmentResponse;
    last_author_is_bot: boolean;
    last_author_id: string;
    last_author_display_name: string;
    last_author_avatar?: string;
    group_id?: string;
    draft_id: string;
    company_id?: string;
    bracket_id?: string;
    avatar: string;
}

interface SleeperSettingsResponse {
    max_keepers: number;
    draft_rounds: number;
    trade_review_days: number;
    reserve_allow_dnr: number;
    capacity_override: number;
    pick_trading: number;
    taxi_years: number;
    taxi_allow_vets: number;
    last_report: number;
    disable_adds: number;
    waiver_type: number;
    bench_lock: number;
    reserve_allow_sus: number;
    type: number;
    waiver_clear_days: number;
    waiver_day_of_week: number;
    start_week: number;
    playoff_teams: number;
    num_teams: number;
    reserve_slots: number;
    daily_waivers_hour: number;
    waiver_budget: number;
    reserve_allow_out: number;
    offseason_adds: number;
    last_scored_leg: number;
    daily_waivers: number;
    divisions: number;
    playoff_week_start: number;
    daily_waivers_days: number;
    league_average_match: number;
    leg: number;
    trade_deadline: number;
    reserve_allow_doubtful: number;
    taxi_deadline: number;
    reserve_allow_na: number;
    taxi_slots: number;
    playoff_type: number;
}

interface SleeperScoringSettingsResponse {
    yds_allow_400_449: number;
    yds_allow_550p: number;
    yds_allow_100_199: number;
    pass_2pt: number;
    pass_int: number;
    fgmiss: number;
    fgmiss_50p: number;
    rec_yd: number;
    xpmiss: number;
    def_pr_td: number;
    fgm_30_39: number;
    yds_allow_450_499: number;
    blk_kick: number;
    pts_allow_7_13: number;
    ff: number;
    fgm_20_29: number;
    fgm_40_49: number;
    pts_allow_1_6: number;
    yds_allow_300_349: number;
    st_fum_rec: number;
    def_pass_def: number;
    yds_allow_500_549: number;
    def_st_ff: number;
    st_ff: number;
    yds_allow_0_100: number;
    yds_allow_350_399: number;
    pts_allow_28_34: number;
    fgm_50p: number;
    fum_rec: number;
    def_td: number;
    fgm_0_19: number;
    int: number;
    pts_allow_0: number;
    pts_allow_21_27: number;
    rec_2pt: number;
    rec: number;
    fgmiss_30_39: number;
    xpm: number;
    st_td: number;
    def_st_fum_rec: number;
    def_st_td: number;
    sack: number;
    fgm: number;
    rush_2pt: number;
    fgmiss_40_49: number;
    rec_td: number;
    pts_allow_35p: number;
    pts_allow_14_20: number;
    rush_yd: number;
    fgm_yds_over_30: number;
    pass_int_td: number;
    pass_yd: number;
    pass_td: number;
    rush_td: number;
    fgmiss_0_19: number;
    def_kr_td: number;
    fum_lost: number;
    yds_allow_200_299: number;
    fgmiss_20_29: number;
    fum: number;
    safe: number;
}

interface SleeperUserResponse {
    user_id: string;
    is_bot: boolean;
    display_name: string;
    avatar: string;
}

interface SleeperDropResponse {
    years_exp?: any;
    team: string;
    status?: any;
    sport: string;
    position: string;
    player_id: string;
    number?: any;
    news_updated?: any;
    last_name: string;
    injury_status?: any;
    first_name: string;
}

interface SleeperAddResponse {
    years_exp?: any;
    team: string;
    status?: any;
    sport: string;
    position: string;
    player_id: string;
    number?: any;
    news_updated?: any;
    last_name: string;
    injury_status?: any;
    first_name: string;
}

interface SleeperUserTransactionResponse {
    user: SleeperLastMessageAttachmentResponse;
    status: string;
    settings ?: any;
    metadata ?: any;
    drops: SleeperDropResponse[];
    dropped_picks: any[];
    dropped_budget: any[];
    adds: SleeperAddResponse[];
    added_picks: any[];
    added_budget: any[];
}

interface SleeperDatumResponse {
    type: string;
    transactions_by_roster: [{ teamId: SleeperUserTransactionResponse; }];
}

interface SleeperLastMessageAttachmentResponse {
    type: string;
    data: SleeperDatumResponse[];
}
