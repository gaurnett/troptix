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

export function setUserFromResponse(response, firebaseUser): User {
  const user = new User();

  user.id = firebaseUser.uid;
  user.email = firebaseUser.email;

  if (firebaseUser.displayName !== null) {
    user.name = firebaseUser.displayName;
  }

  if (response !== null) {
    user.createdAt = response.createdAt;
    user.updatedAt = response.updatedAt;
    user.name = response.name;
    user.stripeId = response.stripeId;
  }

  return user;
}
