class PositionalStats {
    public qb_points: number;
    public rb_points: number;
    public wr_points: number;
    public te_points: number;
    public k_points: number;
    public d_st_points: number;
    public qb_potential_points: number;
    public rb_potential_points: number;
    public wr_potential_points: number;
    public te_potential_points: number;
    public k_potential_points: number;
    public d_st_potential_points: number;

    constructor() {
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

    public getPositionalScores(): number[] {
        return [this.qb_points, this.rb_points, this.wr_points, this.te_points, this.k_points, this.d_st_points];
    }

    public getPositionalPotentialScores(): number[] {
        return [this.qb_points, this.rb_points, this.wr_points, this.te_points, this.k_points, this.d_st_points];
    }
}