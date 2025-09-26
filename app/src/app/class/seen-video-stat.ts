export class SeenVideoStat {
    count: number;
    timeSpent: number; // in minutes
    rating: number;
    countThisMonth: number;
    countThisYear: number;
    favoriteType: string;

    constructor(count: number, timeSpent: number, rating: number, countThisMonth: number, countThisYear: number, favoriteType: string) {
        this.count = count;
        this.timeSpent = timeSpent;
        this.rating = rating;
        this.countThisMonth = countThisMonth;
        this.countThisYear = countThisYear;
        this.favoriteType = favoriteType;
    }
}
