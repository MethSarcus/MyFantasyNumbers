enum SEASON_PORTION {
    REGULAR = "Regular Season",
    POST = "Post-Season",
    ALL = "Complete Season",
}

enum DRAFT_TYPE {
    AUCTION,
    SNAKE,
    LINEAR,
}

enum LEAGUE_TYPE {
    DYNASTY,
    REDRAFT,
}

enum SCORING_TYPE {
    STANDARD,
    HALF_PPR,
    FULL_PPR,
}

enum POSITION {
    QB = "QB",
    RB = "RB",
    WR = "WR",
    TE = "TE",
    K = "K",
    D_ST = "D/ST",
    DL = "DL",
    LB = "LB",
    DB = "DB",
}

function getPosition(eligibleSlots: number[]): POSITION {
    if (eligibleSlots[0] === 0) {
        return POSITION.QB;
    } else if (eligibleSlots[0] === 2) {
        return POSITION.RB;
    } else if (eligibleSlots[0] === 3) {
        return POSITION.WR;
    } else if (eligibleSlots[0] === 16) {
        return POSITION.D_ST;
    } else if (eligibleSlots[0] === 17) {
        return POSITION.K;
    } else if (eligibleSlots[0] === 5) {
        return POSITION.TE;
    }
}

function getLineupSlot(lineupSlotID: number): string {
    if (lineupSlotID === 0) {
        return "QB";
    } else if (lineupSlotID === 2) {
        return "RB";
    } else if (lineupSlotID === 23) {
        return "FLEX";
    } else if (lineupSlotID === 20) {
        return "BENCH";
    } else if (lineupSlotID === 21) {
        return "IR";
    } else if (lineupSlotID === 4) {
        return "WR";
    } else if (lineupSlotID === 16) {
        return "D/ST";
    } else if (lineupSlotID === 17) {
        return "K";
    } else if (lineupSlotID === 6) {
        return "TE";
    }
}

function includesPlayer(player: Player, lineup: Player[]): boolean {
    let includes = false;
    lineup.forEach((element) => {
        if (player.playerID === element.playerID) {
            includes = true;
        }
    });
    return includes;
}

function calcStandardDeviation (scores: number[]): number {
    var modified = [];
    var mean = getMean(scores);
    scores.forEach((score) =>{
        modified.push(Math.pow(score - mean, 2));
    });

    return roundToHundred(Math.sqrt(getMean(modified)));
}

function getMean(numbers: number[]): number {
    var sum = 0;
    numbers.forEach(num => {
        sum += num;
    });

    return sum/numbers.length;
}