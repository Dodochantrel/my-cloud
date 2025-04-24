import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';

@Entity()
export class Video {
  // Id de the movie db
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  // Un boolean pour dire si favoris
  @Column({ default: false })
  isFavorite: boolean;

  // Un boolean pour dire si déjà vu.
  @Column({ default: false })
  isSeen: boolean;

  // Un boolean pour dire si a voir plus tard
  @Column({ default: false })
  isToWatch: boolean;

  // Un number pour la note de 1 à 5
  @Column({ nullable: true })
  rating: number | null;

  // Date de visionnage
  @Column({ nullable: true })
  dateSeen: Date | null;

  @ManyToOne(() => User, (user) => user.videos)
  user: Relation<User>;

  fileUrl: string;
  type: string;
  releaseDate: string;
  description: string;
  genre: VideoGenre;

  constructor(partial: Partial<Video>) {
    Object.assign(this, partial);
  }
}

export class VideoGenre {
  id: number;
  name: string;

  constructor(partial: Partial<VideoGenre>) {
    Object.assign(this, partial);
  }
}
