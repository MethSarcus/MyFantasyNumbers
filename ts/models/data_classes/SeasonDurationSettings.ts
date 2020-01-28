class SeasonDurationSettings {
    constructor(public startWeek: number,
         public regularSeasonLength: number,
          public playoffLength: number,
           public currentMatchupPeriod: number,
           public isActive: boolean,
           public yearsActive: number[] = yearsActive.sort((a, b) => b - a)) {
    }
}