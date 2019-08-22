var SEASON_PORTION;
(function (SEASON_PORTION) {
    SEASON_PORTION["REGULAR"] = "Regular Season";
    SEASON_PORTION["POST"] = "Post-Season";
    SEASON_PORTION["ALL"] = "Complete Season";
})(SEASON_PORTION || (SEASON_PORTION = {}));
var DRAFT_TYPE;
(function (DRAFT_TYPE) {
    DRAFT_TYPE[DRAFT_TYPE["AUCTION"] = 0] = "AUCTION";
    DRAFT_TYPE[DRAFT_TYPE["SNAKE"] = 1] = "SNAKE";
    DRAFT_TYPE[DRAFT_TYPE["LINEAR"] = 2] = "LINEAR";
})(DRAFT_TYPE || (DRAFT_TYPE = {}));
var LEAGUE_TYPE;
(function (LEAGUE_TYPE) {
    LEAGUE_TYPE[LEAGUE_TYPE["DYNASTY"] = 0] = "DYNASTY";
    LEAGUE_TYPE[LEAGUE_TYPE["REDRAFT"] = 1] = "REDRAFT";
})(LEAGUE_TYPE || (LEAGUE_TYPE = {}));
var SCORING_TYPE;
(function (SCORING_TYPE) {
    SCORING_TYPE[SCORING_TYPE["STANDARD"] = 0] = "STANDARD";
    SCORING_TYPE[SCORING_TYPE["HALF_PPR"] = 1] = "HALF_PPR";
    SCORING_TYPE[SCORING_TYPE["FULL_PPR"] = 2] = "FULL_PPR";
})(SCORING_TYPE || (SCORING_TYPE = {}));
var POSITION;
(function (POSITION) {
    POSITION["QB"] = "QB";
    POSITION["RB"] = "RB";
    POSITION["WR"] = "WR";
    POSITION["TE"] = "TE";
    POSITION["K"] = "K";
    POSITION["D_ST"] = "D/ST";
    POSITION["DL"] = "DL";
    POSITION["LB"] = "LB";
    POSITION["DB"] = "DB";
})(POSITION || (POSITION = {}));
function getPosition(eligibleSlots) {
    if (eligibleSlots[0] === 0) {
        return POSITION.QB;
    }
    else if (eligibleSlots[0] === 2) {
        return POSITION.RB;
    }
    else if (eligibleSlots[0] === 3) {
        return POSITION.WR;
    }
    else if (eligibleSlots[0] === 16) {
        return POSITION.D_ST;
    }
    else if (eligibleSlots[0] === 17) {
        return POSITION.K;
    }
    else if (eligibleSlots[0] === 5) {
        return POSITION.TE;
    }
}
function getLineupSlot(lineupSlotID) {
    if (lineupSlotID === 0) {
        return "QB";
    }
    else if (lineupSlotID == 2) {
        return "RB";
    }
    else if (lineupSlotID == 23) {
        return "FLEX";
    }
    else if (lineupSlotID == 20) {
        return "BENCH";
    }
    else if (lineupSlotID == 21) {
        return "IR";
    }
    else if (lineupSlotID == 4) {
        return "WR";
    }
    else if (lineupSlotID == 16) {
        return "D/ST";
    }
    else if (lineupSlotID == 17) {
        return "K";
    }
    else if (lineupSlotID == 6) {
        return "TE";
    }
}
function includesPlayer(player, lineup) {
    var includes = false;
    lineup.forEach(function (element) {
        if (player.playerID == element.playerID) {
            includes = true;
        }
    });
    return includes;
}
function calcStandardDeviation(scores) {
    var modified = [];
    var mean = getMean(scores);
    scores.forEach(function (score) {
        modified.push(Math.pow(score - mean, 2));
    });
    return roundToHundred(Math.sqrt(getMean(modified)));
}
function getMean(numbers) {
    var sum = 0;
    numbers.forEach(function (num) {
        sum += num;
    });
    return roundToHundred(sum / numbers.length);
}
//# sourceMappingURL=Utils.js.map