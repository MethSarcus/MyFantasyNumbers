// Individual entry in the sleeper player library
interface SleeperPlayerLibraryEntry {
        birth_country: string;
        search_full_name: string;
        sportradar_id: string;
        birth_city: string;
        injury_status: string;
        position: string;
        first_name: string;
        high_school: string;
        number: number;
        birth_date: string;
        injury_start_date: string;
        team: string;
        rotoworld_id: string;
        depth_chart_order: string;
        gsis_id: string;
        birth_state: string;
        age: number;
        hashtag: string;
        full_name: string;
        years_exp: string;
        search_last_name: string;
        rotowire_id: number;
        search_first_name: string;
        weight: string;
        espn_id: number;
        fantasy_data_id: number;
        injury_body_part: string;
        practice_description: string;
        yahoo_id: number;
        stats_id: string;
        depth_chart_position: string;
        player_id: string;
        injury_notes: string;
        fantasy_positions: string[];
        college: string;
        active: boolean;
        news_updated: string;
        sport: string;
        search_rank: number;
        height: string;
        practice_participation: string;
        status: string;
        last_name: string;
}

interface SleeperPlayerLibrary {
        [key: string]: SleeperPlayerLibraryEntry;
}

interface SleeperPlayerLibraryKey {
        type: string;
        data: SleeperPlayerLibraryEntry;
    }
