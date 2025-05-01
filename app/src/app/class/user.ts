export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  findInitials(): string {
    const firstNameInitial = this.firstName.charAt(0).toUpperCase();
    const lastNameInitial = this.lastName.charAt(0).toUpperCase();
    return `${firstNameInitial}${lastNameInitial}`;
  }
}

export const defaultUser = new User(0, '', '', '', new Date(), new Date());
