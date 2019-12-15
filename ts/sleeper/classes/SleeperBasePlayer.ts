class SleeperBasePlayer {
    public firstName: string;
    public lastName: string;
    public position: string;
    public realTeamID: string;
    public playerID: string;
    public espnID: string;
    public age: number;
    public pictureURL: string;
    public nickName: string = "";

    constructor(entry: SleeperPlayerLibraryEntry) {
        this.playerID = entry.player_id;
        this.firstName = entry.first_name;
        this.lastName = entry.last_name;
        this.position = entry.position;
        this.realTeamID = entry.team;
        this.age = entry.age;
        if (entry.espn_id) {
            this.espnID = entry.espn_id.toString();
        } else {
            this.espnID = this.playerID;
        }
        this.setPictureURL();
    }

    public setPictureURL(): void {
        if (this.position === "D/ST" || this.position === "DEF") {
            this.pictureURL = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/NFL/500/" + getRealTeamInitials(this.realTeamID) + ".png&h=150&w=150";
        } else {
            this.pictureURL = "http://a.espncdn.com/i/headshots/nfl/players/full/" + this.espnID + ".png";
        }
    }
}
