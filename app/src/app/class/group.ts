import { User } from './user';

export class Group {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  users: User[];

  constructor(id: number, name: string, createdAt: Date, updatedAt: Date, users: User[]) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.users = users;
  }
}
