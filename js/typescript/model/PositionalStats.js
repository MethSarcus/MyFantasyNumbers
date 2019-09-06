var PositionalStats = /** @class */ (function () {
    function PositionalStats() {
        this.qb_points = 0;
        this.rb_points = 0;
        this.wr_points = 0;
        this.te_points = 0;
        this.k_points = 0;
        this.d_st_points = 0;
        this.qb_potential_points = 0;
        this.rb_potential_points = 0;
        this.wr_potential_points = 0;
        this.te_potential_points = 0;
        this.k_potential_points = 0;
        this.d_st_potential_points = 0;
    }
    PositionalStats.prototype.getPositionalScores = function () {
        return [this.qb_points, this.rb_points, this.wr_points, this.te_points, this.k_points, this.d_st_points];
    };
    PositionalStats.prototype.getPositionalPotentialScores = function () {
        return [this.qb_points, this.rb_points, this.wr_points, this.te_points, this.k_points, this.d_st_points];
    };
    return PositionalStats;
}());
//# sourceMappingURL=PositionalStats.js.map