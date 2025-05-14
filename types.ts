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
};
