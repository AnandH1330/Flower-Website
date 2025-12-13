// src/pages/CategoryProducts.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../Api/axiosInstance";
import ProductCard from "../components/ProductCard";

// Banner Images
import DecorationImg from "../assets/Banner/1.png";
import AaramImg from "../assets/Banner/2.png";
import Dryfruitsimg from "../assets/Banner/4.png";
import MoneyImg from "../assets/Banner/5.png";
import BoqueteImg from "../assets/Banner/7.png";
import DefaultImg from "../assets/Banner/banner6.png";

export default function CategoryProducts() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  // Friendly category names
  const nameFix = {
    aaram: "Aaram",
    bouquets: "Bouquets",
    decoration: "Decoration",
    "dry-fruits-garland": "Dry Fruits Garland",
    "money-garland": "Money Garland",
    "rosepetal": "Rosepetal Garland", 
    "sammangi": "Sammangi Garland",
    "lotus": "Lotus Garland",
  };

  // Banner images
  const categoryImages = {
    aaram: AaramImg,
    decoration: DecorationImg,
    "dry-fruit-garland": Dryfruitsimg,
    "money-garland": MoneyImg,
    bouquets: BoqueteImg,
    "rosepetal": DefaultImg,
    lotus: DefaultImg,
    "sammangi": DefaultImg,
  };

  const bannerImage = categoryImages[slug] || DefaultImg;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const res = await axiosInstance.get("/products/");

        // Filter by safe slug
        const filtered = res.data.filter((item) => {
          if (!item.category) return false; // no category → skip

          const itemSlug =
            (item.category.slug ||
              item.category.name?.toLowerCase().replace(/\s+/g, "-"))?.toLowerCase();

          return itemSlug === slug.toLowerCase();
        });

        // Generate readable name
        const readableName =
          nameFix[slug] ||
          filtered[0]?.category?.name ||
          slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

        setCategoryName(readableName);
        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  return (
    <div className="bg-pink-50 min-h-screen">
      {/* Top Banner */}
      <div className="w-full p-8 md:p-12 bg-white shadow-sm mb-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src={bannerImage}
              alt={categoryName}
              className="w-full rounded-2xl shadow-lg"
            />
          </div>

          <div>
            <h1 className="heading1 text-4xl text-pink-700 mb-4">
              {loading ? "Loading..." : categoryName}
            </h1>
            <p className="heading3 text-gray-700 text-lg">
              Explore our beautiful {categoryName} collection.
            </p>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center text-gray-600 py-10">Loading products…</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          No products found.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
