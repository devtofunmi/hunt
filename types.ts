// types.ts
export type Product = {
  id: string; // or number, whichever is correct for your backend
  title: string;
  name: string;
  description: string;
  logo: string;
  shortDescription: string;
  fullDescription: string;
  link: string;
  userId: string;
  githubUrl: string;
  tags: string[];
  upvotes: number;
  createdAt: string;
  saved?: boolean;
  user: User;

};

type SocialLink = {
  platform: string;
  url: string;
};

type User = {
  twitter: string;
  github: string;
  linkedin: string;
  bluesky: string;
  id: string;
  username: string;
  image: string;
  bio: string;
  socialLinks: SocialLink[];
};
