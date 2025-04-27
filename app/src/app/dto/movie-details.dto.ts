import { MovieDetails } from "../class/video";

export interface MovieDetailsDto {
  duration: number;
  originalTitle: string;
  tagline: string;
}

export const mapFromMovieDetailsDtoToMovieDetails = (
    movieDetailsDto: MovieDetailsDto
): MovieDetails => {
    return {
        duration: movieDetailsDto.duration,
        originalTitle: movieDetailsDto.originalTitle,
        tagline: movieDetailsDto.tagline,
    };
}
