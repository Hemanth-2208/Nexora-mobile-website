import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Mobile } from "@/types/database";
import MobileDetailsContent from "@/components/mobile/mobile-details-content";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const supabase = await createClient();
    const { data: mobile } = await supabase
      .from("mobiles")
      .select("*")
      .eq("id", id)
      .eq("hidden", false)
      .single();

    if (!mobile) {
      return {
        title: "Mobile Not Found | Premium Collection",
        description: "The requested smartphone details could not be found.",
      };
    }

    const title = `${mobile.brand} ${mobile.name} | Premium Collection`;
    return {
      title,
      description: mobile.description,
      alternates: {
        canonical: `https://ecom-mobile-website.vercel.app/mobiles/${id}`,
      },
      openGraph: {
        title,
        description: mobile.description,
        url: `https://ecom-mobile-website.vercel.app/mobiles/${id}`,
        images: mobile.images && mobile.images.length > 0 ? [mobile.images[0]] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: mobile.description,
      }
    };
  } catch (err) {
    console.error("Error generating metadata:", err);
    return {
      title: "Mobile Details | Premium Collection",
    };
  }
}

export default async function MobileDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch single mobile details
  const { data: mobile, error: mobileError } = await supabase
    .from("mobiles")
    .select("*")
    .eq("id", id)
    .eq("hidden", false)
    .single();

  if (mobileError || !mobile) {
    if (mobileError && mobileError.code !== "PGRST116") {
      throw new Error("Failed to load device details.");
    }
    notFound();
  }

  // 2. Fetch latest 8 mobiles (excluding current) to prioritize brand match in JS
  const { data: potentialRelated, error: relatedError } = await supabase
    .from("mobiles")
    .select("*")
    .eq("hidden", false)
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(8);

  if (relatedError) {
    console.error("Error loading related mobiles:", relatedError);
  }

  const relatedMobiles = potentialRelated
    ? [
        ...potentialRelated.filter((m) => m.brand.toLowerCase() === mobile.brand.toLowerCase()),
        ...potentialRelated.filter((m) => m.brand.toLowerCase() !== mobile.brand.toLowerCase()),
      ].slice(0, 4)
    : [];

  const currentPrice = mobile.discount_price !== null && mobile.discount_price !== undefined
    ? mobile.discount_price
    : mobile.price;

  const jsonLdProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${mobile.brand} ${mobile.name}`,
    "image": mobile.images || [],
    "description": mobile.description,
    "sku": mobile.id,
    "mpn": mobile.id,
    "category": "Electronics > Communications > Telephony > Mobile Phones",
    "brand": {
      "@type": "Brand",
      "name": mobile.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `https://ecom-mobile-website.vercel.app/mobiles/${mobile.id}`,
      "priceCurrency": "INR",
      "price": currentPrice,
      "priceValidUntil": "2030-01-01",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": mobile.stock_status === "Out of Stock" 
        ? "https://schema.org/OutOfStock" 
        : "https://schema.org/InStock"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <MobileDetailsContent
        mobile={mobile as Mobile}
        relatedMobiles={(relatedMobiles as Mobile[]) || []}
      />
    </>
  );
}
