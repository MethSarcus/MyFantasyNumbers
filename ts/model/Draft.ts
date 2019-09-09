class Draft {
    public leagueID: number;
    public year: number;
    public draftType: DRAFT_TYPE;
    public auctionBudget: number;
    public pickOrder: number[];
    public draftPicks: DraftPick[];
    constructor(leagueID, year, draftType, pickOrder, draftPicks, auctionBudget) {
        this.leagueID = leagueID;
        this.year = year;
        this.draftType = draftType;
        this.auctionBudget = auctionBudget;
        this.pickOrder = pickOrder;
        this.draftPicks = draftPicks;
    }
}
