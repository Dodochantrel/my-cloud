import { SeenVideoStat } from "../class/seen-video-stat";

export interface SeenVideoStatDto {
    count: number;
    timeSpent: number; // in minutes
    rating: number;
    countThisMonth: number;
    countThisYear: number;
    favoriteType: string;
}

export const mapFromDtoToSeenVideoStat = (dto: SeenVideoStatDto) => {
    return new SeenVideoStat(
        dto.count,
        dto.timeSpent,
        dto.rating,
        dto.countThisMonth,
        dto.countThisYear,
        dto.favoriteType
    );
}