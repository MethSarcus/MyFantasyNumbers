var PositionalStats = (function () {
    function PositionalStats() {
        this.qbPoints = 0;
        this.rbPoints = 0;
        this.wrPoints = 0;
        this.tePoints = 0;
        this.kPoints = 0;
        this.defPoints = 0;
        this.qbPotentialPoints = 0;
        this.rbPotentialPoints = 0;
        this.wrPotentialPoints = 0;
        this.tePotentialPoints = 0;
        this.kPotentialPoints = 0;
        this.defPotentialPoints = 0;
    }
    PositionalStats.prototype.getPositionalScores = function () {
        return [this.qbPoints, this.rbPoints, this.wrPoints, this.tePoints, this.kPoints, this.defPoints];
    };
    PositionalStats.prototype.getPositionalPotentialScores = function () {
        return [this.qbPoints, this.rbPoints, this.wrPoints, this.tePoints, this.kPoints, this.defPoints];
    };
    return PositionalStats;
}());
//# sourceMappingURL=PositionalStats.js.map