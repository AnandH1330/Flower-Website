
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import WishlistButton from "../components/WishlistButton";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`);
        if (!res.ok) return console.error("API Error:", res.status);
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.image || data.image_url);
      } catch (err) {
        console.error("Product fetch failed:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  const gallery = Array.isArray(product.gallery) ? product.gallery : [];
  const related = Array.isArray(product.related_products)
    ? product.related_products
    : [];

  const safePrice = Number(product.price || 0);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    toast.success("🌸 Added to Cart Successfully!", {
      style: {
        marginTop: "60px",
        borderRadius: "14px",
        background: "#fff0f7",
        color: "#b30059",
        padding: "12px 16px",
        fontSize: "14px",
      },
      iconTheme: { primary: "#ff0080ff", secondary: "#fff" },
    });
  };

  return (
    <div className="w-full flex flex-col items-center mt-10 mb-10 px-4">
      {/* MAIN GRID */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT SECTION */}
        <div>
          <div className="w-[450px] h-[500px] border rounded-xl overflow-hidden shadow-sm relative">
            {/* WISHLIST */}
            <div className="absolute top-4 right-4 z-10">
              <WishlistButton product={product} />
            </div>

            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4">
            {[product.image || product.image_url, ...gallery].slice(0, 4).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-lg border cursor-pointer object-cover transition-opacity duration-300 hover:opacity-80 ${
                  selectedImage === img ? "ring-2 ring-pink-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col justify-start">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>

          <div className="text-3xl font-semibold text-black mb-4">
            ₹ {safePrice.toFixed(2)}
            <span className="text-sm text-gray-500 ml-2">
              Inclusive of all taxes
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 my-4">
            <p className="font-medium">Quantity:</p>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                className="px-4 py-2 bg-gray-100 text-xl"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <span className="px-4 py-2 text-lg">{quantity}</span>
              <button
                className="px-4 py-2 bg-gray-100 text-xl"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
          </div>

          {/* ADD TO CART / BUY */}
          <div className="flex gap-4 my-4">
            <button
              onClick={handleAddToCart}
              className="mt-5 w-full bg-gradient-to-r from-pink-600 to-pink-700 text-white py-3 rounded-xl shadow-md hover:shadow-xl hover:from-pink-700 hover:to-pink-800 transition-all duration-300 font-semibold text-sm tracking-wide"
            >
              Add to Cart
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold" onClick={() => navigate("/payment")}>
              
              Buy Now
            </button>
          </div>

          <div className="text-sm text-gray-500 flex items-center gap-2 mt-2">
            🔒 100% Secure Payment
          </div>

          {/* DETAILS */}
          <div className="mt-8">
            <details className="border-b py-4">
              <summary className="font-semibold cursor-pointer text-lg">
                Description
              </summary>
              <p className="mt-3 text-gray-600">{product.description}</p>
            </details>

            <details className="border-b py-4">
              <summary className="font-semibold cursor-pointer text-lg">
                Product Specification
              </summary>
              <p className="mt-3 text-gray-600">
                {product.specification || "No specifications available"}
              </p>
            </details>

            <details className="border-b py-4">
              <summary className="font-semibold cursor-pointer text-lg">
                Delivery Information
              </summary>
              <p className="mt-3 text-gray-600">
                {product.delivery_info || "Delivery details not provided"}
              </p>
            </details>

            <details className="border-b py-4">
              <summary className="font-semibold cursor-pointer text-lg">
                Care Instructions
              </summary>
              <p className="mt-3 text-gray-600">
                {product.care || "No care instructions available"}
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="mt-14 max-w-6xl w-full">
          <h2 className="text-2xl font-bold mb-5">Related Products</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {related.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
