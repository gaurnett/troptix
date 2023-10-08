enum Role {
  PATRON,
  ORGANIZER
}

export class User {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  email: string;
  stripeId: string;
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
  user.stripeId = response.stripeId;

  // user.role = response.role;

  return user;
}
