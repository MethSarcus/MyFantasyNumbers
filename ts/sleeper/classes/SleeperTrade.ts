class SleeperTrade {
    public initiatingMemberId: string;
    public initiatingTeamId: number;
    public consentingTeamIds: number[];
    public playersTraded: Map<number, SleeperBasePlayer[]> = new Map<number, SleeperBasePlayer[]>();
    public faabTraded: Map<number, number> = new Map<number, number>();
    public draftPicksInvolved: SleeperDraftPick[] = [];
    public playersReceived: Map<number, SleeperBasePlayer[]> = new Map<number, SleeperBasePlayer[]>();
    public week: number;
    public transactionId: string;

    constructor(trade: SleeperTransactionResponse, lib: SleeperPlayerLibrary) {
        this.initiatingMemberId = trade.creator;
        this.initiatingTeamId = trade.consenter_ids[0];
        this.consentingTeamIds = trade.consenter_ids;
        this.week = trade.leg;
        this.transactionId = trade.transaction_id;
        this.initTradeMaps();
        this.createTradeMaps(trade, lib);
    }

    private createTradeMaps(trade: SleeperTransactionResponse, lib: SleeperPlayerLibrary): void {
        if (trade.adds) {
            Object.keys(trade.adds).forEach((playerId) => {
                const teamID = trade.adds[playerId];
                this.playersReceived.get(teamID).push(new SleeperBasePlayer(lib[playerId]));
            });
        }

        if (trade.drops) {
            Object.keys(trade.drops).forEach((playerId) => {
                const teamID = trade.drops[playerId];
                this.playersTraded.get(teamID).push(new SleeperBasePlayer(lib[playerId]));
            });
        }

        if (trade.draft_picks.length > 0) {
            trade.draft_picks.forEach((pickResponse) => {
                const tradingTeamID = pickResponse.previous_owner_id;
                const receivingTeamID = pickResponse.owner_id;
                const originalOwnerId = pickResponse.roster_id;
                const season = parseInt(pickResponse.season);
                const round = pickResponse.round;
                this.draftPicksInvolved.push(new SleeperDraftPick(season, round, receivingTeamID, tradingTeamID, originalOwnerId));
            });
        }

        if (trade.waiver_budget.length > 0) {
            trade.waiver_budget.forEach((faabTransaction) => {
                this.faabTraded.set(faabTransaction.receiver, this.faabTraded.get(faabTransaction.receiver += faabTransaction.amount));
                this.faabTraded.set(faabTransaction.sender, this.faabTraded.get(faabTransaction.receiver -= faabTransaction.amount));
            });
        }
    }

    private initTradeMaps(): void {
        this.consentingTeamIds.forEach((teamID) => {
            this.playersTraded.set(teamID, []);
            this.playersReceived.set(teamID, []);
            this.faabTraded.set(teamID, 0);
        });
    }
}
