export type VideoType = 'movie' | 'series';

export class Video {
  id: number;
  isFavorite: boolean;
  isSeen: boolean;
  isToWatch: boolean;
  rating: number;
  title: string;
  releaseDate: Date;
  description: string;
  fileUrl: string;
  dateSeen: string;
  genre: string[];
  type: VideoType;
  casting: Casting[] | null;
  director: Director | null;
  movieDetails: MovieDetails | null;
  providers: VideoProvider[] | null;
  similars: Video[] | null;

  constructor(
    id: number,
    isFavorite: boolean,
    isSeen: boolean,
    isToWatch: boolean,
    rating: number,
    title: string,
    releaseDate: Date,
    description: string,
    fileUrl: string,
    dateSeen: string,
    genre: string[],
    type: VideoType
  ) {
    this.id = id;
    this.isFavorite = isFavorite;
    this.isSeen = isSeen;
    this.isToWatch = isToWatch;
    this.rating = rating;
    this.title = title;
    this.releaseDate = releaseDate;
    this.description = description;
    this.fileUrl = fileUrl;
    this.dateSeen = dateSeen;
    this.genre = genre;
    this.type = type;
    this.casting = null;
    this.director = null;
    this.movieDetails = null;
    this.providers = null;
    this.similars = null;
  }

  formatDuration(): string {
    if (this.movieDetails && this.movieDetails.duration) {
      const hours = Math.floor(this.movieDetails.duration / 60);
      const minutes = this.movieDetails.duration % 60;
      return `${hours}h ${minutes}m`;
    }
    return '';
  }

}

export interface Casting {
  id: number;
  name: string;
  popularity: number;
  character: string;
  order: number;
  fileUrl: string;
}

export interface Director {
  id: number;
  name: string;
  fileUrl: string;
}

export interface MovieDetails {
  duration: number;
  originalTitle: string;
  tagline: string;
}

export interface VideoProvider {
  id: number;
  fileUrl: string;
  name: string;
}
