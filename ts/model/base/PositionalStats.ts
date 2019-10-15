class PositionalStats {
    public qbPoints: number;
    public rbPoints: number;
    public wrPoints: number;
    public tePoints: number;
    public kPoints: number;
    public defPoints: number;
    public qbPotentialPoints: number;
    public rbPotentialPoints: number;
    public wrPotentialPoints: number;
    public tePotentialPoints: number;
    public kPotentialPoints: number;
    public defPotentialPoints: number;

    constructor() {
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

    public getPositionalScores(): number[] {
        return [this.qbPoints, this.rbPoints, this.wrPoints, this.tePoints, this.kPoints, this.defPoints];
    }

    public getPositionalPotentialScores(): number[] {
        return [this.qbPoints, this.rbPoints, this.wrPoints, this.tePoints, this.kPoints, this.defPoints];
    }
}
