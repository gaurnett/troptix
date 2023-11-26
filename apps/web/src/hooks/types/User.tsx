export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  email: string;
  stripeId: string;
  role: Role;
  telephoneNumber: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingCountry: string;
  billingZip: string;
  billingState: string;
};

enum Role {
  PATRON,
  ORGANIZER,
}

export enum SocialMediaAccounts {
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
  TIKTOK = "TIKTOK",
  TWITTER = "TWITTER",
}

export type SocialMediaAccount = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  socialMediaAccountType: keyof typeof SocialMediaAccounts;
  link: string;
};
