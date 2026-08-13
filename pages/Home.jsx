import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import Hero from "@/components/home/Hero";
import LaunchCountdown from "@/components/home/LaunchCountdown";
import Marquee from "@/components/home/Marquee";
import Collections from "@/components/home/Collections";
import FeaturedTee from "@/components/home/FeaturedTee";
import NewArrivals from "@/components/home/NewArrivals";
import Ethos from "@/components/home/Ethos";
import LookbookTeaser from "@/components/home/LookbookTeaser";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featuredTees, setFeaturedTees] = useState([]);

  useEffect(() => {
    const fetchHomeProducts = () => {
      base44.entities.Product.list("-created_date", 12)
        .then((list) => {
          setProducts(list);
          setFeaturedTees(
            ["prod-9", "prod-5"]
              .map((id) => list.find((product) => product.id === id))
              .filter(Boolean),
          );
        })
        .catch((err) => console.warn("Failed to load products on Home:", err));
    };

    fetchHomeProducts();

    window.addEventListener("fortified_products_updated", fetchHomeProducts);
    window.addEventListener("storage", fetchHomeProducts);

    return () => {
      window.removeEventListener("fortified_products_updated", fetchHomeProducts);
      window.removeEventListener("storage", fetchHomeProducts);
    };
  }, []);

  return (
    <div className="bg-white text-black min-h-screen">
      <Hero />
      <LaunchCountdown />
      <Marquee />
      <Collections />
      {featuredTees.map((product) => (
        <FeaturedTee key={product.id} product={product} />
      ))}
      <NewArrivals products={products} />
      <Ethos />
      <LookbookTeaser />
      <Newsletter />
    </div>
  );
}
