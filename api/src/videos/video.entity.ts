import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { MovieDetails } from './interfaces/movie-details.interface';

@Entity()
export class Video {
  // Id de the movie db
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tmdbId: number;

  @Column()
  title: string;

  // Un boolean pour dire si favoris
  @Column({ default: false })
  isFavorite: boolean = false;

  // Un boolean pour dire si déjà vu.
  @Column({ default: false })
  isSeen: boolean = false;

  // Un boolean pour dire si a voir plus tard
  @Column({ default: false })
  isToWatch: boolean = false;

  // Un number pour la note de 1 à 5
  @Column({ nullable: true })
  rating: number | null = null;

  // Date de visionnage
  @Column({ nullable: true })
  dateSeen: Date | null;

  @Column()
  type: VideoType;

  @ManyToOne(() => User, (user) => user.videos)
  user: Relation<User>;

  fileUrl: string;
  releaseDate: string;
  description: string;
  genre: string[];

  movieDetails: MovieDetails | null;

  constructor(partial: Partial<Video>) {
    Object.assign(this, partial);
  }
}

export type VideoType = 'movie' | 'series';
