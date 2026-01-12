
// import React from "react";
// import { useCart } from "../Context/CartContext";
// import WishlistButton from "./WishlistButton";
// import toast from "react-hot-toast";
// import { FaStar } from "react-icons/fa";
// import { FiTruck } from "react-icons/fi";
// import { Link } from "react-router-dom";

// export default function ProductCard({ product }) {
//   if (!product) return null;

//   const { addToCart } = useCart();

//   const handleAddToCart = () => {
//     addToCart(product);
//     toast.success("🌸 Added to Cart Successfully!", {
//       style: {
//         marginTop: "60px",
//         borderRadius: "14px",
//         background: "#fff0f7",
//         color: "#b30059",
//         padding: "12px 16px",
//         fontSize: "14px",
//       },
//       iconTheme: { primary: "#ff0080ff", secondary: "#fff" },
//     });
//   };

//   // SAFE VALUES
//   const productImage = product.image || product.image_url || "/placeholder.png";
//   const rating = Number(product.rating) || 0;
//   const discountPercent = Number(product.discount_percent) || 0;
//   const originalPrice = Number(product.price) || 0;
//   const discountedPrice = Number(product.discounted_price) || originalPrice;

//   return (
//     <div
//       className="w-[280px] sm:w-[300px] md:w-[320px]
//         relative bg-white/70 backdrop-blur-xl 
//         border border-pink-100/60 rounded-2xl 
//         shadow-md hover:shadow-2xl 
//         hover:-translate-y-2 hover:scale-[1.02] 
//         transition-all duration-500 
//         overflow-hidden group
//       "
//     >
//       {/* DISCOUNT BANNER */}
//       {discountPercent > 0 && (
//         <div className="
//     absolute top-3 left-3 z-20
//     bg-gradient-to-r from-red-500 to-pink-500
//     text-white px-4 py-2 rounded-xl
//     shadow-lg 
//     flex flex-col sm:flex-row sm:items-center gap-1
//     animate-pulse
//   ">
//           <span className="font-bold text-sm sm:text-base">
//             {discountPercent}% OFF
//           </span>

//           <span className="text-xs sm:text-sm opacity-90 font-medium">
//             Save ₹{(originalPrice - discountedPrice).toFixed(2)}
//           </span>
//         </div>
//       )}

//       {/* WISHLIST BUTTON */}
//       <div className="absolute top-3 right-3 z-20">
//         <WishlistButton product={product} />
//       </div>

//       {/* PRODUCT IMAGE */}
//       <Link to={`/product/${product.id}`}>
       
//         <div className="w-full h-64 sm:h-72 md:h-80 flex items-center justify-center bg-white overflow-hidden">
//           <img
//             src={productImage}
//             alt={product.name || "Product"}
//             className="
//       w-full h-full 
//       object-cover 
//       transition-all duration-500 
//       group-hover:scale-105 
      
//     "
//           />
//         </div>


//         <div className="p-5 flex flex-col">
//           <h3 className="text-lg font-semibold text-gray-800 leading-6 line-clamp-2">
//             {product.name || "Unnamed Product"}
//           </h3>

//           <div className="w-14 h-1.5 bg-pink-400 rounded-full my-3"></div>

//           {/* RATING SECTION — FIXED */}
//           <div className="flex items-center gap-2 my-3">
//             <div className="flex">
//               {[...Array(5)].map((_, i) => (
//                 <FaStar
//                   key={i}
//                   size={16}
//                   className={
//                     i < Math.round(rating)
//                       ? "text-yellow-400"
//                       : "text-gray-300"
//                   }
//                 />
//               ))}
//             </div>
//             <span className="text-sm font-medium text-gray-600">
//               {rating > 0 ? `${rating.toFixed(1)} out of 5` : "No ratings"}
//             </span>
//           </div>

//           {/* PRICE SECTION */}
//           <div className="flex items-center gap-3 mb-3">
//             <span
//               className="
//                 text-2xl font-extrabold 
//                 bg-gradient-to-r from-pink-600 to-pink-800 
//                 text-transparent bg-clip-text
//               "
//             >
//               ₹{discountedPrice.toFixed(2)}
//             </span>

//             {discountPercent > 0 && (
//               <span className="text-sm font-semibold text-gray-400 line-through">
//                 ₹{originalPrice.toFixed(2)}
//               </span>
//             )}
//           </div>

//           {/* SHORT DESCRIPTION */}
//           {product.short_description && (
//             <p className="text-xs text-gray-600 line-clamp-2 mb-4">
//               {product.short_description}
//             </p>
//           )}
//         </div>
//       </Link>

//       {/* ADD TO CART BUTTON */}
//       <div className="px-5 pb-5">
//         <button
//           onClick={handleAddToCart}
//           className="
//             w-full bg-gradient-to-r from-pink-500 to-orange-400 
//             text-white font-semibold py-2 rounded-xl 
//             hover:shadow-lg hover:scale-105 
//             transition-all duration-300
//           "
//         >
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// }




import React from "react";
import { useCart } from "../Context/CartContext";
import WishlistButton from "./WishlistButton";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { FiTruck } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  if (!product) return null;

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
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

  // SAFE VALUES
  const productImage = product.image || product.image_url || "/placeholder.png";
  const rating = Number(product.rating) || 0;
  const discountPercent = Number(product.discount_percent) || 0;
  const originalPrice = Number(product.price) || 0;
  const discountedPrice = Number(product.discounted_price) || originalPrice;

  return (
    <div
      className="
        relative w-full max-w-[320px] min-h-[490px]
        bg-white/70 backdrop-blur-xl
        border border-pink-100/60 rounded-2xl
        shadow-md hover:shadow-2xl
        hover:-translate-y-2 hover:scale-[1.02]
        transition-all duration-500
        overflow-hidden group
      "
    >
      {/* DISCOUNT BADGE */}
      {discountPercent > 0 && (
        <div
          className="
            absolute top-3 left-3 z-20
            bg-gradient-to-r from-red-500 to-pink-500
            text-white px-3 py-1.5 rounded-xl
            shadow-lg text-sm font-bold
          "
        >
          {discountPercent}% OFF
        </div>
      )}

      {/* WISHLIST */}
      <div className="absolute top-3 right-3 z-20">
        <WishlistButton product={product} />
      </div>

      <Link to={`/product/${product.id}`}>
        {/* IMAGE */}
        <div className="w-full h-[300px] sm:h-[360px] md:h-[380px] bg-white overflow-hidden">
          <img
            src={productImage}
            alt={product.name || "Product"}
            className="
              w-full h-full object-cover
              transition-transform duration-500
              group-hover:scale-105
            "
          />
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col">
          {/* TITLE */}
          <h3 className="text-lg font-semibold text-gray-800 min-h-[48px] line-clamp-2">
            {product.name || "Unnamed Product"}
          </h3>

          <div className="w-14 h-1.5 bg-pink-400 rounded-full my-2"></div>

          {/* RATING */}
          <div className="flex items-center gap-2 my-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={15}
                  className={
                    i < Math.round(rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {rating > 0 ? rating.toFixed(1) : "No ratings"}
            </span>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-3 my-2">
            <span
              className="
                text-xl font-extrabold
                bg-gradient-to-r from-pink-600 to-pink-800
                text-transparent bg-clip-text
              "
            >
              ₹{discountedPrice.toFixed(2)}
            </span>

            {discountPercent > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <p className="text-xs text-gray-600 line-clamp-2 min-h-[32px]">
            {product.short_description || ""}
          </p>
        </div>
      </Link>

      {/* ADD TO CART */}
      <div className="px-4 pb-4 mt-auto">
        <button
          onClick={handleAddToCart}
          className="
            w-full h-[42px]
            bg-gradient-to-r from-pink-500 to-orange-400
            text-white font-semibold rounded-xl
            hover:shadow-lg hover:scale-105
            transition-all duration-300
          "
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
