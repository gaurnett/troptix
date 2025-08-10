import { User as FirebaseUser } from 'firebase/auth';

export type User = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  firstName?: string;
  lastName?: string;
  email?: string;
  stripeId?: string;
  role?: Role;
  isOrganizer?: boolean;
  jwtToken?: string;
  telephoneNumber?: string;
  billingAddress1?: string;
  billingAddress2?: string;
  billingCity?: string;
  billingCountry?: string;
  billingZip?: string;
  billingState?: string;
};

enum Role {
  PATRON,
  ORGANIZER,
}

export enum SocialMediaAccounts {
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  TWITTER = 'TWITTER',
}

export type SocialMediaAccount = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  socialMediaAccountType: keyof typeof SocialMediaAccounts;
  link: string;
};

export async function initializeUser(
  firebaseUser: FirebaseUser
): Promise<User> {
  const token = await firebaseUser
    .getIdToken(/* forceRefresh */ true)
    .then(function (idToken) {
      return idToken;
    })
    .catch(function (error) {
      return undefined;
    });

  const user: User = {
    id: firebaseUser.uid,
    jwtToken: token as string,
  };

  user.email = firebaseUser.email as string;

  if (firebaseUser.displayName !== null) {
    const name = String(firebaseUser.displayName).split(' ');
    user.firstName = name[0];

    if (name.length > 1) {
      user.lastName = name[1];
    }
  }

  return user;
}

export function initializeUserWithJwtToken(token: string): User {
  const user: User = {
    id: '',
    jwtToken: token,
  };

  return user;
}
