class Draft {
    public leagueID: string;
    public year: number;
    public draftType: DRAFT_TYPE;
    public auctionBudget: number;
    public pickOrder: number[];
    public draftPicks: DraftPick[];
    constructor(leagueID: string, year: number, draftType: DRAFT_TYPE, pickOrder: number[], draftPicks: DraftPick[], auctionBudget: number) {
        this.leagueID = leagueID;
        this.year = year;
        this.draftType = draftType;
        this.auctionBudget = auctionBudget;
        this.pickOrder = pickOrder;
        this.draftPicks = draftPicks;
    }
}
