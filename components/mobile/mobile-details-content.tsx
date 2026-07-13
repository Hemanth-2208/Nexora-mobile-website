'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Smartphone,
  ArrowRight,
  ShoppingBag,
  Star,
  Zap,
  Camera,
  Gamepad2,
  Tv,
  Battery,
  Radio,
  ChevronRight,
  Truck,
  CreditCard,
  Layers,
  Sparkles,
} from "lucide-react";

import { Mobile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { cn, isValidImageUrl } from "@/lib/utils";
import MobileCard from "@/components/mobile/mobile-card";

interface MobileDetailsContentProps {
  mobile: Mobile;
  relatedMobiles: Mobile[];
}

interface Specs {
  brand: string;
  processor: string;
  chipset: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  expandableStorage: string;
  displaySize: string;
  displayType: string;
  refreshRate: string;
  resolution: string;
  rearCamera: string;
  frontCamera: string;
  battery: string;
  charging: string;
  operatingSystem: string;
  network: string;
  fiveG: string;
  bluetooth: string;
  wifi: string;
  usbType: string;
  simType: string;
  fingerprint: string;
  faceUnlock: string;
  ipRating: string;
  weight: string;
  dimensions: string;
  color: string;
  warranty: string;
  launchDate: string;
}

// Specifications Mapper to dynamically supply missing fields based on db values
function getDeviceSpecifications(mobile: Mobile): Specs {
  const brandLower = mobile.brand.toLowerCase();
  const nameLower = mobile.name.toLowerCase();

  const specs: Specs = {
    brand: mobile.brand,
    processor: mobile.processor || "High-performance Processor",
    chipset: mobile.processor || "High-performance Processor",
    cpu: "Octa-core CPU",
    gpu: "Mali-G series / Adreno GPU",
    ram: mobile.ram.toUpperCase().includes("GB") ? mobile.ram : `${mobile.ram} GB`,
    storage: mobile.storage.toUpperCase().includes("GB") || mobile.storage.toUpperCase().includes("TB") ? mobile.storage : `${mobile.storage} GB`,
    expandableStorage: "No",
    displaySize: mobile.display || "6.7 inches",
    displayType: "Super AMOLED capacitive touchscreen",
    refreshRate: "120Hz",
    resolution: "2400 x 1080 pixels (FHD+)",
    rearCamera: mobile.camera || "Triple Camera System",
    frontCamera: "16MP Selfie Camera, f/2.2",
    battery: mobile.battery.toUpperCase().includes("MAH") ? mobile.battery : `${mobile.battery} mAh`,
    charging: "33W Fast Charging",
    operatingSystem: "Android 14",
    network: "5G / 4G LTE / 3G / 2G",
    fiveG: "Yes",
    bluetooth: "Bluetooth 5.3",
    wifi: "Wi-Fi 6 (802.11ax)",
    usbType: "USB Type-C",
    simType: "Dual SIM (Nano-SIM)",
    fingerprint: "Yes (Under-display, optical)",
    faceUnlock: "Yes",
    ipRating: "IP54 dust and splash resistant",
    weight: "185g",
    dimensions: "161.2 x 74.2 x 7.9 mm",
    color: "Slate Grey, Silver Ice",
    warranty: "1 Year Manufacturer Warranty",
    launchDate: "Recent Release",
  };

  // Specific Apple iPhone overrides
  if (brandLower === "apple" || nameLower.includes("iphone")) {
    specs.brand = "Apple";
    specs.operatingSystem = "iOS 18";
    specs.displayType = "Super Retina XDR OLED, HDR10, Dolby Vision";
    specs.refreshRate = nameLower.includes("pro") ? "120Hz ProMotion" : "60Hz";
    specs.cpu = "Apple Hexa-core CPU";
    specs.gpu = "Apple GPU (graphics acceleration)";
    specs.simType = "Dual eSIM (US) / eSIM + Nano-SIM (Global)";
    specs.fingerprint = "No (Face ID only)";
    specs.faceUnlock = "Yes (Face ID)";
    specs.ipRating = "IP68 dust/water resistant (up to 6m for 30 mins)";
    specs.expandableStorage = "No";
    specs.usbType = nameLower.includes("15") || nameLower.includes("16") || nameLower.includes("17")
      ? "USB Type-C 3.2 Gen 2"
      : "Lightning";
    specs.warranty = "1 Year Apple India Warranty";
    specs.bluetooth = "Bluetooth 5.3";
    specs.fiveG = "Yes (SA/NSA)";

    if (nameLower.includes("17")) {
      specs.chipset = "Apple A18 Pro chip (3nm)";
      specs.processor = "A18 Pro chip";
      specs.cpu = "6-core CPU (2 performance and 4 efficiency)";
      specs.gpu = "Apple 6-core GPU";
      specs.frontCamera = "12MP TrueDepth, f/1.9";
      specs.charging = "25W MagSafe Wireless / 25W Wired Fast Charging";
      specs.weight = "227g";
      specs.dimensions = "163.0 x 77.6 x 8.25 mm";
      specs.color = "Desert Titanium, Natural Titanium, White Titanium, Black Titanium";
      specs.launchDate = "September 2025";
      specs.resolution = "2868 x 1320 pixels at 460 ppi";
    } else if (nameLower.includes("16")) {
      specs.chipset = "Apple A18 chip (3nm)";
      specs.processor = "A18 chip";
      specs.cpu = "6-core CPU";
      specs.gpu = "Apple 5-core GPU";
      specs.frontCamera = "12MP TrueDepth, f/1.9";
      specs.charging = "25W MagSafe Wireless / 20W Wired Fast Charging";
      specs.weight = "199g";
      specs.dimensions = "160.7 x 77.6 x 7.8 mm";
      specs.color = "Ultramarine, Teal, Pink, White, Black";
      specs.launchDate = "September 2024";
      specs.resolution = "2796 x 1290 pixels at 460 ppi";
    } else {
      specs.chipset = "Apple A16 Bionic (4nm)";
      specs.frontCamera = "12MP TrueDepth, f/1.9";
      specs.charging = "15W MagSafe Wireless / 20W Wired";
      specs.weight = "201g";
      specs.dimensions = "160.7 x 77.6 x 7.85 mm";
      specs.color = "Space Black, Silver, Gold, Deep Purple";
      specs.launchDate = "September 2023";
    }
  } 
  // Specific Oppo overrides
  else if (brandLower === "oppo" || nameLower.includes("f25")) {
    specs.brand = "OPPO";
    specs.operatingSystem = "ColorOS 14 (Android 14)";
    specs.chipset = "MediaTek Dimensity 7050 (6 nm)";
    specs.cpu = "Octa-core (2x2.6 GHz Cortex-A78 & 6x2.0 GHz Cortex-A55)";
    specs.gpu = "Mali-G68 MC4";
    specs.displayType = "AMOLED, 1B colors, HDR10+";
    specs.refreshRate = "120Hz";
    specs.resolution = "2412 x 1080 pixels (FHD+)";
    specs.frontCamera = "32MP Selfie Camera, f/2.4";
    specs.charging = "67W SUPERVOOC Fast Charge (100% in 48 mins)";
    specs.expandableStorage = "Yes, up to 2TB via MicroSD";
    specs.weight = "177g";
    specs.dimensions = "161.6 x 74.7 x 7.5 mm";
    specs.color = "Lava Red, Ocean Blue";
    specs.ipRating = "IP65 dust and water resistant";
    specs.launchDate = "March 2024";
    specs.bluetooth = "Bluetooth 5.2";
    specs.wifi = "Wi-Fi 6 (802.11ax)";
  } 
  // Specific Motorola overrides
  else if (brandLower === "moto" || brandLower.includes("motorola") || nameLower.includes("edge")) {
    specs.brand = "Motorola";
    specs.operatingSystem = "Android 14 (Hello UI)";
    specs.chipset = "MediaTek Dimensity 7300 (4 nm)";
    specs.cpu = "Octa-core (4x2.5 GHz Cortex-A78 & 4x2.0 GHz Cortex-A55)";
    specs.gpu = "Mali-G615 MC2";
    specs.displayType = "pOLED, HDR10+, 1B colors";
    specs.refreshRate = "144Hz";
    specs.resolution = "2712 x 1220 pixels (1.5K)";
    specs.frontCamera = "50MP Selfie Camera, f/2.4";
    specs.charging = "68W TurboPower Fast Charging";
    specs.expandableStorage = "No";
    specs.weight = "175g";
    specs.dimensions = "162.0 x 74.4 x 7.9 mm";
    specs.color = "Hot Pink, Forest Green, Marshmallow Blue";
    specs.ipRating = "IP68 dust and water resistant";
    specs.launchDate = "August 2024";
    specs.bluetooth = "Bluetooth 5.3";
    specs.wifi = "Wi-Fi 6E / Wi-Fi 7";
  } 
  // Specific Samsung overrides
  else if (brandLower === "samsung" || nameLower.includes("galaxy")) {
    specs.brand = "Samsung";
    specs.operatingSystem = "One UI 6.1 (Android 14)";
    specs.chipset = "Exynos 2400 / Snapdragon 8 Gen 3";
    specs.displayType = "Dynamic AMOLED 2X, HDR10+, 2600 nits";
    specs.refreshRate = "120Hz LTPO";
    specs.frontCamera = "12MP Dual Pixel Selfie, f/2.2";
    specs.charging = "45W Fast Charging, 15W Wireless Charging";
    specs.weight = "196g";
    specs.dimensions = "147.0 x 70.6 x 7.6 mm";
    specs.color = "Titanium Violet, Titanium Yellow, Titanium Gray, Titanium Black";
    specs.ipRating = "IP68 dust/water resistant (up to 1.5m for 30 mins)";
    specs.launchDate = "January 2024";
  }

  return specs;
}

export default function MobileDetailsContent({ mobile, relatedMobiles }: MobileDetailsContentProps) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transform: "scale(1)",
    transformOrigin: "center center",
  });

  const hasImages = mobile.images && mobile.images.length > 0;
  const isOutOfStock = mobile.stock_status === "Out of Stock";
  const extSpecs = getDeviceSpecifications(mobile);

  // Computations
  const discountPercent =
    mobile.discount_price !== null && mobile.discount_price !== undefined
      ? Math.round(((mobile.price - mobile.discount_price) / mobile.price) * 100)
      : 0;

  const emiCost = Math.round(
    (mobile.discount_price !== null && mobile.discount_price !== undefined
      ? mobile.discount_price
      : mobile.price) / 12
  );

  // Keyboard navigation
  const nextImage = useCallback(() => {
    if (!hasImages) return;
    setActiveImgIndex((prev) => (prev < mobile.images.length - 1 ? prev + 1 : 0));
  }, [hasImages, mobile.images]);

  const prevImage = useCallback(() => {
    if (!hasImages) return;
    setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : mobile.images.length - 1));
  }, [hasImages, mobile.images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, prevImage]);

  // Image Zoom Interactions
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.7)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center center",
    });
  };

  const getStockBadgeStyles = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-450 dark:border-emerald-900/40";
      case "Limited Stock":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-450 dark:border-amber-900/40";
      case "Out of Stock":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-450 dark:border-rose-900/40";
      default:
        return "bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800";
    }
  };

  // Specs Grouped by Category
  const specCategories = [
    {
      title: "Processor & Performance",
      specs: [
        { label: "Processor Name", value: extSpecs.processor },
        { label: "Chipset", value: extSpecs.chipset },
        { label: "CPU", value: extSpecs.cpu },
        { label: "GPU", value: extSpecs.gpu },
      ],
    },
    {
      title: "Memory & Storage",
      specs: [
        { label: "RAM Capacity", value: extSpecs.ram },
        { label: "Internal Storage", value: extSpecs.storage },
        { label: "Expandable Storage", value: extSpecs.expandableStorage },
      ],
    },
    {
      title: "Display Features",
      specs: [
        { label: "Display Size", value: extSpecs.displaySize },
        { label: "Display Type", value: extSpecs.displayType },
        { label: "Refresh Rate", value: extSpecs.refreshRate },
        { label: "Resolution", value: extSpecs.resolution },
      ],
    },
    {
      title: "Camera System",
      specs: [
        { label: "Rear Camera", value: extSpecs.rearCamera },
        { label: "Front Camera", value: extSpecs.frontCamera },
      ],
    },
    {
      title: "Battery & Charging",
      specs: [
        { label: "Battery Capacity", value: extSpecs.battery },
        { label: "Charging Speed", value: extSpecs.charging },
      ],
    },
    {
      title: "Connectivity & OS",
      specs: [
        { label: "Operating System", value: extSpecs.operatingSystem },
        { label: "Network Support", value: extSpecs.network },
        { label: "5G Compatible", value: extSpecs.fiveG },
        { label: "Bluetooth Version", value: extSpecs.bluetooth },
        { label: "Wi-Fi", value: extSpecs.wifi },
        { label: "USB Connector", value: extSpecs.usbType },
        { label: "SIM Options", value: extSpecs.simType },
      ],
    },
    {
      title: "Design & Security",
      specs: [
        { label: "Fingerprint Reader", value: extSpecs.fingerprint },
        { label: "Face Unlock", value: extSpecs.faceUnlock },
        { label: "IP Water Rating", value: extSpecs.ipRating },
        { label: "Device Weight", value: extSpecs.weight },
        { label: "Dimensions", value: extSpecs.dimensions },
        { label: "Available Colors", value: extSpecs.color },
      ],
    },
    {
      title: "Warranty & Launch",
      specs: [
        { label: "Warranty Period", value: extSpecs.warranty },
        { label: "Launch Date", value: extSpecs.launchDate },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-16 selection:bg-blue-500/20">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/mobiles"
          className="group inline-flex items-center gap-2 text-xs font-bold text-zinc-400 dark:text-zinc-550 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors uppercase tracking-widest"
        >
          <ChevronLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Mobiles</span>
        </Link>
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start mb-24">
        
        {/* Left Column: Image Gallery (45%) */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full lg:sticky lg:top-24">
          
          {/* Main Showcase Image */}
          <div
            className="relative aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-150/80 dark:border-zinc-800/80 shadow-[0_8px_40px_rgba(0,0,0,0.015)] group cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <AnimatePresence mode="wait">
              {hasImages && !imgError[activeImgIndex] && isValidImageUrl(mobile.images[activeImgIndex]) ? (
                <motion.div
                  key={activeImgIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={mobile.images[activeImgIndex]}
                    alt={`${mobile.name} view ${activeImgIndex + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-contain p-6 sm:p-12 transition-transform duration-200 ease-out origin-center"
                    style={zoomStyle}
                    priority
                    onError={() => setImgError((prev) => ({ ...prev, [activeImgIndex]: true }))}
                  />
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900/40 dark:to-zinc-950/40 text-zinc-400 dark:text-zinc-650 p-8 select-none">
                  <Smartphone className="size-24 stroke-[1] mb-4 text-zinc-300 dark:text-zinc-850" />
                  <span className="text-xs font-bold tracking-widest uppercase mb-1">{mobile.brand}</span>
                  <span className="text-sm font-semibold">{mobile.name}</span>
                </div>
              )}
            </AnimatePresence>

            {/* Availability Badge Overlay */}
            <div className="absolute top-6 left-6 z-10">
              <span className={cn(
                "inline-flex items-center px-3.5 py-1.5 rounded-full text-[10px] font-bold border backdrop-blur-md shadow-sm",
                getStockBadgeStyles(mobile.stock_status)
              )}>
                <span className={cn(
                  "size-1.5 rounded-full mr-2",
                  mobile.stock_status === "In Stock" && "bg-emerald-500",
                  mobile.stock_status === "Limited Stock" && "bg-amber-500",
                  mobile.stock_status === "Out of Stock" && "bg-rose-500"
                )} />
                {mobile.stock_status}
              </span>
            </div>

            {/* Quick Gallery Overlay Controls */}
            {hasImages && mobile.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-150/40 dark:border-zinc-800/40 text-zinc-800 dark:text-zinc-200 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-305 cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-150/40 dark:border-zinc-800/40 text-zinc-800 dark:text-zinc-200 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-305 cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails below */}
          {hasImages && mobile.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar">
              {mobile.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={cn(
                    "relative size-20 sm:size-24 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border shrink-0 transition-all duration-305 shadow-sm cursor-pointer",
                    activeImgIndex === idx
                      ? "border-blue-500 ring-4 ring-blue-500/10 scale-95"
                      : "border-zinc-200/80 dark:border-zinc-800/80 opacity-70 hover:opacity-100 hover:scale-98"
                  )}
                  aria-label={`Switch to image ${idx + 1}`}
                >
                  {isValidImageUrl(img) ? (
                    <Image
                      src={img}
                      alt={`${mobile.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                      <Smartphone className="size-6 text-zinc-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions (55%) */}
        <div className="lg:col-span-7 flex flex-col w-full lg:pl-4">
          {/* Brand */}
          <span className="text-xs font-black tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 mb-2">
            {extSpecs.brand || mobile.brand}
          </span>

          {/* Device Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 dark:text-zinc-550 tracking-tight leading-tight mb-4">
            {mobile.name}
          </h1>

          {/* Rating & Reviews row */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400 stroke-[1.5]" />
              ))}
            </div>
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 border-l border-zinc-200 dark:border-zinc-800 pl-4">
              5.0 Star Rating
            </span>
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
              (245 Customer Reviews)
            </span>
          </div>

          {/* Price Block */}
          <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-150/60 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.003)]">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest mb-2 block">
              Pricing Details
            </span>
            
            {mobile.discount_price !== null && mobile.discount_price !== undefined ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4.5xl font-black text-zinc-950 dark:text-zinc-50">
                    ₹{mobile.discount_price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-base sm:text-lg text-zinc-400 dark:text-zinc-500 line-through font-medium">
                    ₹{mobile.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150/40 dark:border-emerald-900/40 px-3 py-1 rounded-full">
                    {discountPercent}% OFF
                  </span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-450 font-bold mt-1">
                  You save ₹{(mobile.price - mobile.discount_price).toLocaleString("en-IN")}!
                </p>
              </div>
            ) : (
              <span className="text-3xl sm:text-4.5xl font-black text-zinc-950 dark:text-zinc-50">
                ₹{mobile.price.toLocaleString("en-IN")}
              </span>
            )}

            {/* EMI & Shipping Value Adds */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-zinc-150/60 dark:border-zinc-800/80">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <CreditCard className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">EMI Available</span>
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500">No Cost EMI from ₹{emiCost.toLocaleString("en-IN")}/mo</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 flex items-center justify-center shrink-0">
                  <Truck className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Free Express Delivery</span>
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500">Guaranteed by tomorrow morning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-wider mb-3">Overview</h3>
            <p className="text-sm sm:text-base text-zinc-550 dark:text-zinc-400 leading-relaxed font-normal">
              {mobile.description}
            </p>
          </div>

          {/* Action Buttons (Desktop/Tablet) */}
          <div className="hidden md:flex flex-col sm:flex-row gap-4 mb-8">
            {!isOutOfStock ? (
              <Button
                asChild
                className="flex-1 justify-center bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-955 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-2xl py-6.5 text-xs font-black shadow-md cursor-pointer transition-all duration-300"
              >
                <Link href="/contact" className="flex items-center gap-2 justify-center">
                  <ShoppingBag className="size-4" />
                  <span>Contact Store</span>
                </Link>
              </Button>
            ) : (
              <Button
                disabled
                className="flex-1 justify-center bg-zinc-100 text-zinc-450 dark:bg-zinc-850 dark:text-zinc-650 rounded-2xl py-6.5 text-xs font-bold border border-zinc-200/10 cursor-not-allowed select-none"
              >
                Out of Stock
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              className="flex-1 justify-center border-zinc-250 hover:border-zinc-350 dark:border-zinc-850 dark:hover:border-zinc-750 bg-white dark:bg-zinc-900 text-zinc-850 dark:text-zinc-200 rounded-2xl py-6.5 text-xs font-black cursor-pointer transition-all duration-300 shadow-sm"
            >
              <Link href="/mobiles" className="flex items-center gap-2 justify-center">
                <span>Browse Mobiles</span>
              </Link>
            </Button>
          </div>

          {/* Specs Highlights */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider mb-3">Highlights</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-0.5 p-4 bg-white dark:bg-zinc-900/50 border border-zinc-150/70 dark:border-zinc-800/80 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">RAM</span>
                <span className="text-xs sm:text-sm font-black text-zinc-800 dark:text-zinc-200">{extSpecs.ram}</span>
              </div>
              <div className="flex flex-col gap-0.5 p-4 bg-white dark:bg-zinc-900/50 border border-zinc-150/70 dark:border-zinc-800/80 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Storage</span>
                <span className="text-xs sm:text-sm font-black text-zinc-800 dark:text-zinc-200">{extSpecs.storage}</span>
              </div>
              <div className="flex flex-col gap-0.5 p-4 bg-white dark:bg-zinc-900/50 border border-zinc-150/70 dark:border-zinc-800/80 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Battery</span>
                <span className="text-xs sm:text-sm font-black text-zinc-800 dark:text-zinc-200">{extSpecs.battery}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Section */}
      <section className="mb-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
            <Sparkles className="size-3 text-blue-600 dark:text-blue-400" />
            <span>Key Technologies</span>
          </div>
          <h2 className="text-2xl sm:text-3.5xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
            Premium Features
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <Zap className="size-8 text-amber-500 mb-4 stroke-[1.5]" />
            <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1">⚡ Fast Charging</h4>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-550 line-clamp-2">{extSpecs.charging}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <Camera className="size-8 text-blue-500 mb-4 stroke-[1.5]" />
            <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1">📷 Camera System</h4>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-550 line-clamp-2">{extSpecs.rearCamera}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <Gamepad2 className="size-8 text-rose-500 mb-4 stroke-[1.5]" />
            <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1">🎮 Gaming Core</h4>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-550 line-clamp-2">{extSpecs.processor}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <Tv className="size-8 text-indigo-500 mb-4 stroke-[1.5]" />
            <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1">📺 AMOLED Screen</h4>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-550 line-clamp-2">{extSpecs.displaySize} {extSpecs.displayType}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <Battery className="size-8 text-emerald-500 mb-4 stroke-[1.5]" />
            <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1">🔋 Big Battery</h4>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-550 line-clamp-2">{extSpecs.battery}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <Radio className="size-8 text-cyan-500 mb-4 stroke-[1.5]" />
            <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1">📡 Ultra-fast 5G</h4>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-550 line-clamp-2">{extSpecs.network}</p>
          </div>
        </div>
      </section>

      {/* Technical Specifications Section */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-8 pb-3 border-b border-zinc-150 dark:border-zinc-850">
          <Layers className="size-5 text-blue-500" />
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-zinc-50">
            Technical Specifications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {specCategories.map((category, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-150/60 dark:border-zinc-800/80 rounded-3xl"
            >
              <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
                {category.title}
              </h3>
              <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-850">
                {category.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between py-3.5 text-xs">
                    <span className="font-semibold text-zinc-400 dark:text-zinc-550">{spec.label}</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 text-right max-w-[65%] leading-relaxed">
                      {spec.value || "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Database Raw Specifications Cards Section */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-8 pb-3 border-b border-zinc-150 dark:border-zinc-850">
          <Layers className="size-5 text-blue-500" />
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-zinc-50">
            Database Fields & Specs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-widest block mb-2">Identifier</span>
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Product ID:</div>
            <div className="text-xs font-black text-zinc-900 dark:text-zinc-100 break-all select-all">{mobile.id}</div>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-widest block mb-2">Display & Screen</span>
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Display Value:</div>
            <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">{mobile.display || "N/A"}</div>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-widest block mb-2">Core Processor</span>
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Processor Value:</div>
            <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">{mobile.processor || "N/A"}</div>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-widest block mb-2">Rear Camera</span>
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Camera Value:</div>
            <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">{mobile.camera || "N/A"}</div>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-widest block mb-2">Battery capacity</span>
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Battery Value:</div>
            <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">{mobile.battery || "N/A"}</div>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-widest block mb-2">RAM Capacity</span>
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">RAM Value:</div>
            <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">{mobile.ram || "N/A"}</div>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-widest block mb-2">Storage Capacity</span>
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Storage Value:</div>
            <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">{mobile.storage || "N/A"}</div>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/70 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-widest block mb-2">Record Timestamps</span>
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-0.5">Created At:</div>
            <div className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 mb-2">{new Date(mobile.created_at).toLocaleString()}</div>
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-0.5">Updated At:</div>
            <div className="text-[10px] font-black text-zinc-900 dark:text-zinc-100">{new Date(mobile.updated_at).toLocaleString()}</div>
          </div>
        </div>
      </section>

      {/* Related Mobiles Section */}
      {relatedMobiles.length > 0 && (
        <section className="border-t border-zinc-100 dark:border-zinc-900/80 pt-16">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/20 text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                <span>Similar devices</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-zinc-50">
                Related Smartphones
              </h2>
            </div>
            <Link
              href="/mobiles"
              className="group flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-widest"
            >
              <span>See All</span>
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {relatedMobiles.map((item) => (
              <MobileCard key={item.id} mobile={item} />
            ))}
          </div>
        </section>
      )}

      {/* Floating Sticky Bottom Bar for Mobile View */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/70 dark:bg-zinc-955/70 border-t border-zinc-200/80 dark:border-zinc-850/80 backdrop-blur-lg z-40 flex gap-3 shadow-2xl">
        {!isOutOfStock ? (
          <Button
            asChild
            className="flex-1 justify-center bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-955 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-xl py-5.5 text-xs font-black"
          >
            <Link href="/contact" className="flex items-center gap-1.5 justify-center">
              <ShoppingBag className="size-4" />
              <span>Contact Store</span>
            </Link>
          </Button>
        ) : (
          <Button
            disabled
            className="flex-1 justify-center bg-zinc-150 text-zinc-400 dark:bg-zinc-850 dark:text-zinc-650 rounded-xl py-5.5 text-xs font-bold select-none cursor-not-allowed"
          >
            Out of Stock
          </Button>
        )}
        <Button
          asChild
          variant="outline"
          className="flex-1 justify-center border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-250 rounded-xl py-5.5 text-xs font-black shadow-sm"
        >
          <Link href="/mobiles" className="justify-center">
            <span>Browse Mobiles</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
