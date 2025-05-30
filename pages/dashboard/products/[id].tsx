// pages/dashboard/products/[id].tsx

import ProductPage from '@/pages/landingpage/ProductPage';
import { GetServerSideProps } from 'next';


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

type Product = {
  id: string;
  title: string;
  fullDescription: string;
  shortDescription: string;
  logo: string;
  tags: string[];
  upvotes: number;
  saved?: boolean;
  githubUrl?: string;
  link?: string;
  createdAt: string;
  user: User;
};

type Props = {
  product: Product | null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  try {
    const res = await fetch(`https://launchhunt.up.railway.app/products/${id}`);
    if (!res.ok) {
      return { props: { product: null } };
    }

    const product = await res.json();
    return { props: { product } };
  } catch (error) {
    console.error(error);
    return { props: { product: null } };
  }
};

export default function ProductDetailPage({ product }: Props) {
  return <ProductPage product={product} />;
}
