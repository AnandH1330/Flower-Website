
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../Api/axiosInstance";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    try {
      const res = await API.get("cart/");
      setCartItems(res.data || []);
    } catch (err) {
      console.log("Cart fetch error:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const resolveItem = (itemOrId) => {
    if (!itemOrId) return null;
    if (typeof itemOrId === "object") return itemOrId;
    return cartItems.find((entry) => entry.id === itemOrId) || null;
  };

  // Add product to cart
  const addToCart = async (product) => {
    if (!product?.id) return;
    try {
      const res = await API.post("cart/", {
        product_id: product.id,
        quantity: 1,
      });
      await fetchCart();
      return res.data;
    } catch (err) {
      console.log("Add to cart error:", err);
    }
  };

  // Remove item
  const removeFromCart = async (id) => {
    try {
      await API.delete(`cart/${id}/`);
      await fetchCart();
    } catch (err) {
      console.log("Remove error:", err);
    }
  };

  // Increase qty
  const increaseQty = async (itemOrId) => {
    const item = resolveItem(itemOrId);
    if (!item) return;
    try {
      await API.patch(`cart/${item.id}/`, {
        quantity: item.quantity + 1,
      });
      await fetchCart();
    } catch (err) {
      console.log("Increase qty error:", err);
    }
  };

  // Decrease qty
  const decreaseQty = async (itemOrId) => {
    const item = resolveItem(itemOrId);
    if (!item) return;
    try {
      await API.patch(`cart/${item.id}/`, {
        quantity: item.quantity > 1 ? item.quantity - 1 : 1,
      });
      await fetchCart();
    } catch (err) {
      console.log("Decrease qty error:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

