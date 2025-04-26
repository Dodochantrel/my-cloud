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
  genre: string;
  type: VideoType;

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
    genre: string,
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
  }
}
