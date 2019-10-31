// Entry for a team when hitting matchup endpoint
interface SleeperTeamResponse {
    roster_id: number;
    points: number;
    players: string[];
    matchup_id: number;
    custom_points: number;
    starters: string[];
}
