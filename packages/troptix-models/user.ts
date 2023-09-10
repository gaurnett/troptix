enum Role {
  PATRON,
  ORGANIZER
}

export class User {
  id: String;
  createdAt: Date;
  updatedAt: Date;

  // Event Details
  name: String;
  email: String;
  role: Role;

  constructor() {
  }
}

export function setUserFromResponse(response): User {
  const user = new User();
  user.createdAt = response.createdAt;
  user.updatedAt = response.updatedAt;
  user.id = response.id;
  user.email = response.email;
  user.name = response.name;
  // user.role = response.role;

  return user;
}
