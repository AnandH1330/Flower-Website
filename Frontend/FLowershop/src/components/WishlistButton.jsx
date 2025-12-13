// import React, { useState } from "react";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { useWishlist } from "../Context/WishlistContext";
// import toast from "react-hot-toast";

// const WishlistButton = ({ product }) => {
//   const { addToWishlist, removeFromWishlist, wishlistLookup } = useWishlist();
//   const [loading, setLoading] = useState(false);

//   // Safety check: if product is missing, don't render anything
//   if (!product || !product.id) return null;

//   const isInWishlist = wishlistLookup?.[product.id] ?? false;

//   const handleClick = async () => {
//     if (loading) return;
//     setLoading(true);

//     try {
//       if (isInWishlist) {
//         await removeFromWishlist(product.id);
//         toast.error("💔 Removed from Wishlist");
//       } else {
//         await addToWishlist(product);
//         toast.success("❤️ Added to Wishlist");
//       }
//     } catch (err) {
//       console.error("Wishlist error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleClick}
//       disabled={loading}
//       className={`p-2 rounded-full ${
//         isInWishlist ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-600"
//       }`}
//     >
//       {isInWishlist ? <FaHeart /> : <FaRegHeart />}
//     </button>
//   );
// };

// export default WishlistButton;
import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../Context/WishlistContext";
import toast from "react-hot-toast";

const WishlistButton = ({ product }) => {
  const { addToWishlist, removeFromWishlist, wishlistLookup } = useWishlist();
  const [loading, setLoading] = useState(false);
  const [optimisticState, setOptimisticState] = useState(null);

  if (!product || !product.id) return null;

  const isInWishlist = optimisticState ?? wishlistLookup?.[product.id] ?? false;

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    // Toggle UI immediately
    setOptimisticState(!isInWishlist);

    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id);
        toast.error("💔 Removed from Wishlist");
      } else {
        await addToWishlist(product);
        toast.success("❤️ Added to Wishlist");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      // Rollback on error
      setOptimisticState(isInWishlist);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`p-2 rounded-full transition-colors duration-300 ${
        isInWishlist ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-600"
      }`}
    >
      {isInWishlist ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
};

export default WishlistButton;
