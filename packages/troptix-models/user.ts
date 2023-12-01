import { generateId } from './idHelper';

enum Role {
  PATRON,
  ORGANIZER
}

export class User {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  firstName: string;
  lastName: string;
  email: string;
  stripeId: string;
  role: Role;
  isOrganizer: boolean = false;
  telephoneNumber: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string
  billingCountry: string;
  billingZip: string;
  billingState: string;

  constructor() { }
}

export enum SocialMediaAccountType {
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
  TIKTOK = "TIKTOK",
  TWITTER = "TWITTER"
}

export class SocialMediaAccount {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  socialMediaAccountType: SocialMediaAccountType;
  link: string;

  constructor(userId: string) {
    this.id = generateId();
    this.userId = userId;
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
