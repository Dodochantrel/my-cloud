export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAuthorized: boolean;
  roles: string[] | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    isAuthorized: boolean,
    roles: string[] | null,
    createdAt: Date | null,
    updatedAt: Date | null
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.isAuthorized = isAuthorized;
    this.roles = roles;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  findInitials(): string {
    const firstNameInitial = this.firstName.charAt(0).toUpperCase();
    const lastNameInitial = this.lastName.charAt(0).toUpperCase();
    return `${firstNameInitial}${lastNameInitial}`;
  }

  getFullName(): string {
    return `${this.lastName.toUpperCase()} ${this.firstName}`;
  }
}

export const defaultUser = new User(0, '', '', '', false, [], new Date(), new Date());
