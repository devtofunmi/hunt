import Head from "next/head";
import LandingPage from "./landingpage/landingpage";

export default function Home() {
  return (
    <>
      <Head>
        <title>LaunchHunt – Discover & Launch Amazing Products</title>
        <meta name="description" content="LaunchHunt helps you discover the latest indie products, startups, and side projects. Explore, support, and get inspired." />
        <meta name="keywords" content="product launch, startups, indie hackers, launchhunt, product discovery" />
        <meta name="author" content="LaunchHunt Team" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="LaunchHunt – Discover & Launch Amazing Products" />
        <meta property="og:description" content="Discover the best new startups, side projects, and tools made by indie developers." />
        <meta property="og:image" content="/launchhunt.png" />
        <meta property="og:url" content="https://launchhunt.netlify.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LaunchHunt – Discover & Launch Amazing Products" />
        <meta name="twitter:description" content="Explore new indie products and get inspired to build your own." />
        <meta name="twitter:image" content="/launchhunt.png" />
      </Head>

      <div>
        <LandingPage />
      </div>
    </>
  );
}