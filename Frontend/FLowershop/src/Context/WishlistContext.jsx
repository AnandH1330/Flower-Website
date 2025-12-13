import { createContext, useContext, useEffect, useState, useCallback } from "react";
import API from "../Api/axiosInstance";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

const normalizeWishlistResponse = (items = []) => {
  const products = [];
  const lookup = {};

  items.forEach((item) => {
    if (item?.product?.id) {
      products.push(item.product);
      lookup[item.product.id] = item.id;
    }
  });

  return { products, lookup };
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLookup, setWishlistLookup] = useState({});
  const { isAuthenticated } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      setWishlistLookup({});
      return;
    }

    try {
      const res = await API.get("wishlist/");
      const { products, lookup } = normalizeWishlistResponse(res.data);
      setWishlist(products);
      setWishlistLookup(lookup);
    } catch (err) {
      console.log("Wishlist fetch error:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    if (!product?.id || !isAuthenticated) return;

    if (wishlistLookup[product.id]) {
      console.log("Already in wishlist");
      return;
    }

    try {
      // ✔ FIXED HERE
      const res = await API.post("wishlist/", { product_id: product.id });

      if (!res.data?.product?.id) return;

      setWishlist((prev) => {
        if (prev.some((item) => item.id === res.data.product.id)) return prev;
        return [res.data.product, ...prev];
      });

      setWishlistLookup((prev) => ({
        ...prev,
        [res.data.product.id]: res.data.id,
      }));
    } catch (err) {
      console.error("Add to wishlist error:", err.response?.data || err);
    }
  };


  const removeFromWishlist = async (productId) => {
    if (!productId) return;
    const wishlistItemId = wishlistLookup[productId];
    if (!wishlistItemId) return;

    try {
      await API.delete(`wishlist/${wishlistItemId}/`);
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      setWishlistLookup((prev) => {
        const { [productId]: _, ...rest } = prev;
        return rest;
      });
    } catch (err) {
      console.log("Remove wishlist error:", err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, refetchWishlist: fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
