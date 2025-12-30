"use client";

import { categories } from "@/lib/data";
import { CategorySection } from "./category-section";
import { useProducts } from "@/hooks/useProducts";
import { Loader2, AlertCircle } from "lucide-react";
import { Product } from "@/lib/data";

export function ProductCatalog() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-destructive gap-2">
        <AlertCircle className="h-8 w-8" />
        <p className="text-lg font-medium">Failed to load products</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container pt-4 pb-16 md:pt-6 md:pb-24 space-y-16">
        {categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            products={(products as unknown as Product[]).filter((product) => product.category === category.id)}
          />
        ))}
      </div>
    </div>
  );
}
