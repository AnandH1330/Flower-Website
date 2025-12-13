import React from "react";
import ProductCard from "./ProductCard";

export default function ResponsiveGrid({ products }) {
  return (
    <div
      className="
        w-full
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-8
        px-4 
        md:px-8 
        lg:px-12 
        py-10
        animate-fadeIn
      "
    >
      {products.map((item) => (
        <ProductCard key={item.id} product={item} />
      ))}
    </div>
  );
}
