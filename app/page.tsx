import Hero from "@/components/home/hero";
import BrandMarquee from "@/components/home/brand-marquee";
import FeaturedMobiles from "@/components/home/featured-mobiles";
import CustomerReviews from "@/components/home/customer-reviews";

export const metadata = {
  title: "Nexora | Premium Smartphone Retailer",
  description: "Browse the latest smartphones with state-of-the-art specifications, rates, and detailed user testimonies.",
  alternates: {
    canonical: "https://ecom-mobile-website.vercel.app",
  },
  openGraph: {
    title: "Nexora | Premium Smartphone Retailer",
    description: "Browse the latest smartphones with state-of-the-art specifications, rates, and detailed user testimonies.",
    url: "https://ecom-mobile-website.vercel.app",
    siteName: "Nexora",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora | Premium Smartphone Retailer",
    description: "Browse the latest smartphones with state-of-the-art specifications, rates, and detailed user testimonies.",
  }
};

export default function HomePage() {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nexora",
    "url": "https://ecom-mobile-website.vercel.app",
    "logo": "https://ecom-mobile-website.vercel.app/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 9032535343",
      "contactType": "customer service"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bhanugudi Center",
      "addressLocality": "Kakinada",
      "addressRegion": "Andhra Pradesh",
      "postalCode": "533003",
      "addressCountry": "India"
    }
  };

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nexora",
    "url": "https://ecom-mobile-website.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ecom-mobile-website.vercel.app/mobiles?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
      <Hero />
      <BrandMarquee />
      <FeaturedMobiles />
      <CustomerReviews />
    </>
  );
}


