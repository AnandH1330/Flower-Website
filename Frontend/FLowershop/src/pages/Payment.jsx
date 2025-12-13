// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../Context/CartContext";
// import API from "../Api/axiosInstance";
// import toast from "react-hot-toast";
// import { motion, AnimatePresence } from "framer-motion";

// const Payment = () => {
//   const navigate = useNavigate();
//   const { cartItems, refreshCart } = useCart();
//   const [step, setStep] = useState("cart"); // cart, address, payment, confirm, success
//   const [loading, setLoading] = useState(false);
//   const [addresses, setAddresses] = useState([]);
//   const [error, setError] = useState("");

//   // Form State
//   const [formData, setFormData] = useState({
//     full_name: "",
//     phone: "",
//     address_line1: "",
//     address_line2: "",
//     city: "",
//     state: "",
//     pincode: "",
//     landmark: "",
//   });

//   const [paymentMethod, setPaymentMethod] = useState("gpay"); // gpay, phonepe, cod, card
//   const [cardData, setCardData] = useState({
//     cardNumber: "",
//     expiry: "",
//     cvv: "",
//   });

//   const [selectedAddressId, setSelectedAddressId] = useState(null);

//   // Calculations
//   const itemsTotal = cartItems.reduce((sum, item) => {
//     const price = Number(item.product?.price) || 0;
//     const quantity = Number(item.quantity) || 0;
//     return sum + price * quantity;
//   }, 0);

//   const shipping = itemsTotal > 500 ? 0 : 50;
//   const tax = Math.round(itemsTotal * 0.05); // 5% tax
//   const grandTotal = itemsTotal + shipping + tax;

//   // Fetch saved addresses
//   useEffect(() => {
//     if (step === "address") {
//       fetchAddresses();
//     }
//   }, [step]);

//   const fetchAddresses = async () => {
//     try {
//       const response = await API.get("addresses/");
//       setAddresses(response.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCardChange = (e) => {
//     const { name, value } = e.target;
//     let sanitized = value;

//     if (name === "cardNumber") {
//       sanitized = value.replace(/\D/g, "").slice(0, 16);
//     } else if (name === "expiry") {
//       sanitized = value
//         .replace(/\D/g, "")
//         .slice(0, 4)
//         .replace(/(\d{2})(\d{0,2})/, "$1/$2");
//     } else if (name === "cvv") {
//       sanitized = value.replace(/\D/g, "").slice(0, 3);
//     }

//     setCardData((prev) => ({ ...prev, [name]: sanitized }));
//   };

//   const validateAddress = () => {
//     if (
//       !formData.full_name ||
//       !formData.phone ||
//       !formData.address_line1 ||
//       !formData.city ||
//       !formData.state ||
//       !formData.pincode
//     ) {
//       setError("Please fill all required fields");
//       return false;
//     }
//     if (formData.phone.length !== 10) {
//       setError("Phone number must be 10 digits");
//       return false;
//     }
//     if (formData.pincode.length !== 6) {
//       setError("Pincode must be 6 digits");
//       return false;
//     }
//     setError("");
//     return true;
//   };

//   const validateCard = () => {
//     if (!cardData.cardNumber || cardData.cardNumber.length !== 16) {
//       setError("Invalid card number");
//       return false;
//     }
//     if (!cardData.expiry || cardData.expiry.length !== 5) {
//       setError("Invalid expiry date");
//       return false;
//     }
//     if (!cardData.cvv || cardData.cvv.length !== 3) {
//       setError("Invalid CVV");
//       return false;
//     }
//     setError("");
//     return true;
//   };

//   const handlePlaceOrder = async () => {
//     if (cartItems.length === 0) {
//       toast.error("Cart is empty!");
//       return;
//     }

//     let shippingAddress = "";
//     let billingAddress = "";

//     // Get address
//     if (selectedAddressId) {
//       const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
//       if (selectedAddr) {
//         shippingAddress = `${selectedAddr.full_name}\n${selectedAddr.phone}\n${selectedAddr.address_line1}\n${selectedAddr.address_line2}\n${selectedAddr.city}, ${selectedAddr.state} - ${selectedAddr.pincode}`;
//       }
//     } else {
//       if (!validateAddress()) return;
//       shippingAddress = `${formData.full_name}\n${formData.phone}\n${formData.address_line1}\n${formData.address_line2}\n${formData.city}, ${formData.state} - ${formData.pincode}`;
//     }

//     billingAddress = shippingAddress;

//     // Validate payment method
//     if (paymentMethod === "card" && !validateCard()) return;

//     setLoading(true);
//     setError("");

//     try {
//       // Create checkout
//       const response = await API.post("checkout/", {
//         payment_method: paymentMethod,
//         shipping_address: shippingAddress,
//         billing_address: billingAddress,
//       });

//       const orderId = response.data.id;

//       // Simulate payment processing based on method
//       await simulatePaymentProcessing(paymentMethod);

//       toast.success("Payment successful! Order placed.");
//       await refreshCart();
//       setStep("success");

//       // Redirect after 3 seconds
//       setTimeout(() => {
//         navigate("/delivery");
//       }, 3000);
//     } catch (err) {
//       const errorMsg = err.response?.data?.detail || "Failed to place order";
//       setError(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const simulatePaymentProcessing = async (method) => {
//     return new Promise((resolve) => {
//       toast.loading("Processing payment...");
//       setTimeout(() => {
//         toast.dismiss();
//         resolve();
//       }, 2000);
//     });
//   };

//   // STEP 1: CART REVIEW
//   if (step === "cart") {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 py-12 px-4"
//       >
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-4xl font-bold text-pink-600 mb-8 text-center">
//             🛒 Review Your Cart
//           </h1>

//           {cartItems.length === 0 ? (
//             <div className="bg-white rounded-xl shadow-lg p-12 text-center">
//               <p className="text-2xl text-gray-600 mb-6">Your cart is empty</p>
//               <button
//                 onClick={() => navigate("/products")}
//                 className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
//               >
//                 Continue Shopping
//               </button>
//             </div>
//           ) : (
//             <div className="grid md:grid-cols-3 gap-8">
//               {/* Cart Items */}
//               <div className="md:col-span-2 space-y-4">
//                 {cartItems.map((item) => (
//                   <motion.div
//                     key={item.id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-white rounded-lg shadow p-4 flex gap-4"
//                   >
//                     <img
//                       src={item.product?.image || "https://via.placeholder.com/80"}
//                       alt={item.product?.name}
//                       className="w-24 h-24 rounded object-cover"
//                     />
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-800 text-lg">
//                         {item.product?.name}
//                       </h3>
//                       <p className="text-gray-600">
//                         Qty: {item.quantity} × ₹{Number(item.product?.price).toLocaleString()}
//                       </p>
//                       <p className="text-pink-600 font-bold mt-2">
//                         ₹{(Number(item.product?.price) * item.quantity).toLocaleString()}
//                       </p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Summary */}
//               <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-20">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

//                 <div className="space-y-4 mb-6 pb-6 border-b">
//                   <div className="flex justify-between text-gray-700">
//                     <span>Subtotal</span>
//                     <span>₹{itemsTotal.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-700">
//                     <span>Tax (5%)</span>
//                     <span>₹{tax.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-700">
//                     <span>Shipping</span>
//                     <span className={shipping === 0 ? "text-green-600 font-bold" : ""}>
//                       {shipping === 0 ? "FREE" : `₹${shipping}`}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex justify-between text-2xl font-bold text-pink-600 mb-8">
//                   <span>Total</span>
//                   <span>₹{grandTotal.toLocaleString()}</span>
//                 </div>

//                 <button
//                   onClick={() => setStep("address")}
//                   className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
//                 >
//                   Continue to Delivery
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     );
//   }

//   // STEP 2: DELIVERY ADDRESS
//   if (step === "address") {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 py-12 px-4"
//       >
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center justify-between mb-8">
//             <h1 className="text-4xl font-bold text-pink-600">📍 Delivery Address</h1>
//             <button
//               onClick={() => setStep("cart")}
//               className="text-gray-600 hover:text-gray-800"
//             >
//               ← Back
//             </button>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {/* Form */}
//             <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">
//                 {selectedAddressId ? "Selected Address" : "Enter New Address"}
//               </h2>

//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
//                 >
//                   {error}
//                 </motion.div>
//               )}

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     Full Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="full_name"
//                     value={formData.full_name}
//                     onChange={handleInputChange}
//                     placeholder="John Doe"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     placeholder="9876543210"
//                     maxLength="10"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     Address Line 1 *
//                   </label>
//                   <input
//                     type="text"
//                     name="address_line1"
//                     value={formData.address_line1}
//                     onChange={handleInputChange}
//                     placeholder="123 Main Street"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     Address Line 2
//                   </label>
//                   <input
//                     type="text"
//                     name="address_line2"
//                     value={formData.address_line2}
//                     onChange={handleInputChange}
//                     placeholder="Apartment, suite, etc."
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                   />
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2">
//                       City *
//                     </label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       placeholder="New York"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2">
//                       State *
//                     </label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       placeholder="NY"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2">
//                       Pincode *
//                     </label>
//                     <input
//                       type="tel"
//                       name="pincode"
//                       value={formData.pincode}
//                       onChange={handleInputChange}
//                       placeholder="110001"
//                       maxLength="6"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2">
//                       Landmark (Optional)
//                     </label>
//                     <input
//                       type="text"
//                       name="landmark"
//                       value={formData.landmark}
//                       onChange={handleInputChange}
//                       placeholder="Near XYZ"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setStep("payment")}
//                 className="w-full mt-8 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
//               >
//                 Continue to Payment
//               </button>
//             </div>

//             {/* Saved Addresses */}
//             <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">Saved Addresses</h3>
//               {addresses.length === 0 ? (
//                 <p className="text-gray-600">No saved addresses</p>
//               ) : (
//                 <div className="space-y-3">
//                   {addresses.map((addr) => (
//                     <button
//                       key={addr.id}
//                       onClick={() => {
//                         setSelectedAddressId(addr.id);
//                         setFormData({
//                           full_name: addr.full_name,
//                           phone: addr.phone,
//                           address_line1: addr.address_line1,
//                           address_line2: addr.address_line2,
//                           city: addr.city,
//                           state: addr.state,
//                           pincode: addr.pincode,
//                           landmark: addr.landmark,
//                         });
//                       }}
//                       className={`w-full p-3 rounded-lg text-left border-2 transition ${
//                         selectedAddressId === addr.id
//                           ? "border-pink-500 bg-pink-50"
//                           : "border-gray-200 hover:border-gray-300"
//                       }`}
//                     >
//                       <p className="font-semibold text-gray-800 text-sm">
//                         {addr.full_name}
//                       </p>
//                       <p className="text-xs text-gray-600">{addr.city}</p>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   // STEP 3: PAYMENT METHOD
//   if (step === "payment") {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 py-12 px-4"
//       >
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center justify-between mb-8">
//             <h1 className="text-4xl font-bold text-pink-600">💳 Payment Method</h1>
//             <button
//               onClick={() => setStep("address")}
//               className="text-gray-600 hover:text-gray-800"
//             >
//               ← Back
//             </button>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {/* Payment Methods */}
//             <div className="md:col-span-2 space-y-6">
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
//                 >
//                   {error}
//                 </motion.div>
//               )}

//               {/* UPI Methods */}
//               <div className="grid md:grid-cols-2 gap-4">
//                 {[
//                   { id: "gpay", name: "Google Pay", icon: "🔵" },
//                   { id: "phonepe", name: "PhonePe", icon: "💜" },
//                 ].map((method) => (
//                   <motion.button
//                     key={method.id}
//                     onClick={() => setPaymentMethod(method.id)}
//                     whileHover={{ scale: 1.05 }}
//                     className={`p-6 rounded-xl border-2 transition ${
//                       paymentMethod === method.id
//                         ? "border-pink-500 bg-pink-50"
//                         : "border-gray-200 bg-white hover:border-gray-300"
//                     }`}
//                   >
//                     <p className="text-4xl mb-2">{method.icon}</p>
//                     <p className="font-semibold text-gray-800">{method.name}</p>
//                     <p className="text-sm text-gray-600 mt-1">Instant payment</p>
//                   </motion.button>
//                 ))}
//               </div>

//               {/* Credit/Debit Card */}
//               <motion.button
//                 onClick={() => setPaymentMethod("card")}
//                 whileHover={{ scale: 1.02 }}
//                 className={`w-full p-6 rounded-xl border-2 transition ${
//                   paymentMethod === "card"
//                     ? "border-pink-500 bg-pink-50"
//                     : "border-gray-200 bg-white hover:border-gray-300"
//                 }`}
//               >
//                 <p className="text-2xl mb-2">💳</p>
//                 <p className="font-semibold text-gray-800">Credit/Debit Card</p>
//                 <p className="text-sm text-gray-600 mt-1">Visa, Mastercard, etc.</p>
//               </motion.button>

//               {/* Card Details (shown only if card is selected) */}
//               <AnimatePresence>
//                 {paymentMethod === "card" && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     className="bg-white rounded-xl shadow p-6 space-y-4"
//                   >
//                     <div>
//                       <label className="block text-gray-700 font-semibold mb-2">
//                         Card Number *
//                       </label>
//                       <input
//                         type="text"
//                         name="cardNumber"
//                         value={cardData.cardNumber}
//                         onChange={handleCardChange}
//                         placeholder="1234 5678 9012 3456"
//                         className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 tracking-wider"
//                       />
//                     </div>

//                     <div className="grid md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-gray-700 font-semibold mb-2">
//                           Expiry (MM/YY) *
//                         </label>
//                         <input
//                           type="text"
//                           name="expiry"
//                           value={cardData.expiry}
//                           onChange={handleCardChange}
//                           placeholder="12/25"
//                           className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-gray-700 font-semibold mb-2">
//                           CVV *
//                         </label>
//                         <input
//                           type="password"
//                           name="cvv"
//                           value={cardData.cvv}
//                           onChange={handleCardChange}
//                           placeholder="123"
//                           maxLength="3"
//                           className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                         />
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* COD */}
//               <motion.button
//                 onClick={() => setPaymentMethod("cod")}
//                 whileHover={{ scale: 1.02 }}
//                 className={`w-full p-6 rounded-xl border-2 transition ${
//                   paymentMethod === "cod"
//                     ? "border-pink-500 bg-pink-50"
//                     : "border-gray-200 bg-white hover:border-gray-300"
//                 }`}
//               >
//                 <p className="text-2xl mb-2">💰</p>
//                 <p className="font-semibold text-gray-800">Cash on Delivery</p>
//                 <p className="text-sm text-gray-600 mt-1">Pay when product arrives</p>
//               </motion.button>
//             </div>

//             {/* Order Summary */}
//             <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-20">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Total</h2>

//               <div className="space-y-4 mb-6 pb-6 border-b">
//                 <div className="flex justify-between text-gray-700">
//                   <span>Items</span>
//                   <span>₹{itemsTotal.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-700">
//                   <span>Tax (5%)</span>
//                   <span>₹{tax.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-700">
//                   <span>Shipping</span>
//                   <span className={shipping === 0 ? "text-green-600 font-bold" : ""}>
//                     {shipping === 0 ? "FREE" : `₹${shipping}`}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex justify-between text-2xl font-bold text-pink-600 mb-8">
//                 <span>Total</span>
//                 <span>₹{grandTotal.toLocaleString()}</span>
//               </div>

//               <p className="text-xs text-gray-600 mb-4">
//                 {paymentMethod === "cod"
//                   ? "You will pay on delivery"
//                   : "Payment will be processed securely"}
//               </p>

//               <button
//                 onClick={handlePlaceOrder}
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50"
//               >
//                 {loading ? "Processing..." : "Place Order"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   // STEP 4: SUCCESS
//   if (step === "success") {
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4"
//       >
//         <motion.div
//           initial={{ y: 50 }}
//           animate={{ y: 0 }}
//           className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md"
//         >
//           <motion.div
//             animate={{ scale: [1, 1.2, 1] }}
//             transition={{ repeat: Infinity, duration: 1 }}
//             className="text-7xl mb-6"
//           >
//             ✅
//           </motion.div>
//           <h1 className="text-4xl font-bold text-green-600 mb-4">
//             Order Confirmed!
//           </h1>
//           <p className="text-gray-600 text-lg mb-2">
//             Thank you for your purchase
//           </p>
//           <p className="text-gray-500 mb-8">
//             Redirecting to track your order...
//           </p>
//           <div className="text-3xl font-bold text-pink-600 mb-8">
//             ₹{grandTotal.toLocaleString()}
//           </div>
//           <button
//             onClick={() => navigate("/delivery")}
//             className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
//           >
//             View Order Details
//           </button>
//         </motion.div>
//       </motion.div>
//     );
//   }
// };

// export default Payment;




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import API from "../Api/axiosInstance";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Import payment images
import GooglePayImg from "../assets/Payment/Google Pay.jpeg";
import PhonePeImg from "../assets/Payment/PhonePe App.jpeg";
import CardImg from "../assets/Payment/credit debit logo.jpeg";
import CODImg from "../assets/Payment/Cash on delivery.jpeg";

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, refreshCart } = useCart();
  const [step, setStep] = useState("cart"); // cart, address, payment, success
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("gpay"); // gpay, phonepe, razorpay, card, cod
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Calculations
  const itemsTotal = cartItems.reduce((sum, item) => {
    const price = Number(item.product?.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const shipping = itemsTotal > 500 ? 0 : 50;
  const tax = Math.round(itemsTotal * 0.05);
  const grandTotal = itemsTotal + shipping + tax;

  // Fetch saved addresses
  useEffect(() => {
    if (step === "address") {
      fetchAddresses();
    }
  }, [step]);

  const fetchAddresses = async () => {
    try {
      const response = await API.get("addresses/");
      setAddresses(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let sanitized = value;

    if (name === "cardNumber") {
      sanitized = value.replace(/\D/g, "").slice(0, 16);
    } else if (name === "expiry") {
      sanitized = value
        .replace(/\D/g, "")
        .slice(0, 4)
        .replace(/(\d{2})(\d{0,2})/, "$1/$2");
    } else if (name === "cvv") {
      sanitized = value.replace(/\D/g, "").slice(0, 3);
    }

    setCardData((prev) => ({ ...prev, [name]: sanitized }));
  };

  const validateAddress = () => {
    if (
      !formData.full_name ||
      !formData.phone ||
      !formData.address_line1 ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      setError("Please fill all required fields");
      return false;
    }
    if (formData.phone.length !== 10) {
      setError("Phone number must be 10 digits");
      return false;
    }
    if (formData.pincode.length !== 6) {
      setError("Pincode must be 6 digits");
      return false;
    }
    setError("");
    return true;
  };

  const validateCard = () => {
    if (!cardData.cardNumber || cardData.cardNumber.length !== 16) {
      setError("Invalid card number");
      return false;
    }
    if (!cardData.expiry || cardData.expiry.length !== 5) {
      setError("Invalid expiry date");
      return false;
    }
    if (!cardData.cvv || cardData.cvv.length !== 3) {
      setError("Invalid CVV");
      return false;
    }
    setError("");
    return true;
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    let shippingAddress = "";
    let billingAddress = "";

    // Get address
    if (selectedAddressId) {
      const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
      if (selectedAddr) {
        shippingAddress = `${selectedAddr.full_name}\n${selectedAddr.phone}\n${selectedAddr.address_line1}\n${selectedAddr.address_line2}\n${selectedAddr.city}, ${selectedAddr.state} - ${selectedAddr.pincode}`;
      }
    } else {
      if (!validateAddress()) return;
      shippingAddress = `${formData.full_name}\n${formData.phone}\n${formData.address_line1}\n${formData.address_line2}\n${formData.city}, ${formData.state} - ${formData.pincode}`;
    }

    billingAddress = shippingAddress;

    // Validate payment method
    if (paymentMethod === "card" && !validateCard()) return;

    setLoading(true);
    setError("");

    try {
      // Handle Razorpay payment
      if (paymentMethod === "razorpay") {
        await handleRazorpayPayment(shippingAddress, billingAddress);
        return;
      }

      // Create checkout for other payment methods
      const response = await API.post("checkout/", {
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
      });

      // Simulate payment processing
      await simulatePaymentProcessing(paymentMethod);

      toast.success("Payment successful! Order placed.");
      await refreshCart();
      setStep("success");

      setTimeout(() => {
        navigate("/delivery");
      }, 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to place order";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const simulatePaymentProcessing = async (method) => {
    return new Promise((resolve) => {
      toast.loading("Processing payment...");
      setTimeout(() => {
        toast.dismiss();
        resolve();
      }, 2000);
    });
  };

  const handleRazorpayPayment = async (shippingAddress, billingAddress) => {
    try {
      // First, create the order in backend
      const orderResponse = await API.post("checkout/", {
        payment_method: "razorpay",
        shipping_address: shippingAddress,
        billing_address: billingAddress,
      });

      const orderId = orderResponse.data.id;

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag",
          amount: grandTotal * 100,
          currency: "INR",
          name: "FlowerWeb Shop",
          description: `Order #${orderId}`,
          order_id: orderId,
          handler: async (response) => {
            try {
              await API.post("verify-razorpay/", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderId,
              });

              toast.success("Payment successful! Order placed.");
              await refreshCart();
              setStep("success");

              setTimeout(() => {
                navigate("/delivery");
              }, 3000);
            } catch (err) {
              toast.error("Payment verification failed");
              setError("Payment verification failed");
            }
          },
          prefill: {
            name: formData.full_name || "",
            email: "",
            contact: formData.phone || "",
          },
          theme: {
            color: "#ec4899",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
      document.body.appendChild(script);
    } catch (err) {
      toast.error("Failed to initiate Razorpay payment");
      setError("Failed to initiate Razorpay payment");
    } finally {
      setLoading(false);
    }
  };

  // STEP 1: CART REVIEW
  if (step === "cart") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 py-12 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-pink-600 mb-8 text-center">
            🛒 Review Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-2xl text-gray-600 mb-6">Your cart is empty</p>
              <button
                onClick={() => navigate("/products")}
                className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="md:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow p-4 flex gap-4"
                  >
                    <img
                      src={item.product?.image || "https://via.placeholder.com/80"}
                      alt={item.product?.name}
                      className="w-24 h-24 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {item.product?.name}
                      </h3>
                      <p className="text-gray-600">
                        Qty: {item.quantity} × ₹{Number(item.product?.price).toLocaleString()}
                      </p>
                      <p className="text-pink-600 font-bold mt-2">
                        ₹{(Number(item.product?.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-20">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{itemsTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-bold" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-2xl font-bold text-pink-600 mb-8">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => setStep("address")}
                  className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
                >
                  Continue to Delivery
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // STEP 2: DELIVERY ADDRESS
  if (step === "address") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 py-12 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-pink-600">📍 Delivery Address</h1>
            <button
              onClick={() => setStep("cart")}
              className="text-gray-600 hover:text-gray-800 font-semibold"
            >
              ← Back
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {selectedAddressId ? "Selected Address" : "Enter New Address"}
              </h2>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    maxLength="10"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, etc."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Pincode *
                    </label>
                    <input
                      type="tel"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="110001"
                      maxLength="6"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="Near XYZ"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep("payment")}
                className="w-full mt-8 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
              >
                Continue to Payment
              </button>
            </div>

            {/* Saved Addresses */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Saved Addresses</h3>
              {addresses.length === 0 ? (
                <p className="text-gray-600 text-sm">No saved addresses</p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddressId(addr.id);
                        setFormData({
                          full_name: addr.full_name,
                          phone: addr.phone,
                          address_line1: addr.address_line1,
                          address_line2: addr.address_line2,
                          city: addr.city,
                          state: addr.state,
                          pincode: addr.pincode,
                          landmark: addr.landmark,
                        });
                      }}
                      className={`w-full p-3 rounded-lg text-left border-2 transition ${
                        selectedAddressId === addr.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-semibold text-gray-800 text-sm">
                        {addr.full_name}
                      </p>
                      <p className="text-xs text-gray-600">{addr.city}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // STEP 3: PAYMENT METHOD
  if (step === "payment") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 py-12 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-pink-600">💳 Payment Method</h1>
            <button
              onClick={() => setStep("address")}
              className="text-gray-600 hover:text-gray-800 font-semibold"
            >
              ← Back
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="md:col-span-2 space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                >
                  {error}
                </motion.div>
              )}

              {/* UPI Methods Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Google Pay */}
                <motion.button
                  onClick={() => setPaymentMethod("gpay")}
                  whileHover={{ scale: 1.05 }}
                  className={`p-6 rounded-xl border-2 transition ${
                    paymentMethod === "gpay"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <img
                    src={GooglePayImg}
                    alt="Google Pay"
                    className="h-16 w-full object-contain mb-3"
                  />
                  <p className="font-semibold text-gray-800">Google Pay</p>
                  <p className="text-sm text-gray-600 mt-1">Instant UPI payment</p>
                </motion.button>

                {/* PhonePe */}
                <motion.button
                  onClick={() => setPaymentMethod("phonepe")}
                  whileHover={{ scale: 1.05 }}
                  className={`p-6 rounded-xl border-2 transition ${
                    paymentMethod === "phonepe"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <img
                    src={PhonePeImg}
                    alt="PhonePe"
                    className="h-16 w-full object-contain mb-3"
                  />
                  <p className="font-semibold text-gray-800">PhonePe</p>
                  <p className="text-sm text-gray-600 mt-1">Instant UPI payment</p>
                </motion.button>
              </div>

              {/* Razorpay */}
              <motion.button
                onClick={() => setPaymentMethod("razorpay")}
                whileHover={{ scale: 1.02 }}
                className={`w-full p-6 rounded-xl border-2 transition ${
                  paymentMethod === "razorpay"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <p className="text-3xl mb-2">💳</p>
                <p className="font-semibold text-gray-800">Razorpay</p>
                <p className="text-sm text-gray-600 mt-1">
                  Credit Card, Debit Card, UPI, Wallets & more
                </p>
              </motion.button>

              {/* Credit/Debit Card */}
              <motion.button
                onClick={() => setPaymentMethod("card")}
                whileHover={{ scale: 1.02 }}
                className={`w-full p-6 rounded-xl border-2 transition ${
                  paymentMethod === "card"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <img
                  src={CardImg}
                  alt="Credit/Debit Card"
                  className="h-16 w-full object-contain mb-3"
                />
                <p className="font-semibold text-gray-800">Credit/Debit Card</p>
                <p className="text-sm text-gray-600 mt-1">Visa, Mastercard, etc.</p>
              </motion.button>

              {/* Card Details (shown only if card is selected) */}
              <AnimatePresence>
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-xl shadow p-6 space-y-4"
                  >
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 tracking-wider"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Expiry (MM/YY) *
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardData.expiry}
                          onChange={handleCardChange}
                          placeholder="12/25"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          CVV *
                        </label>
                        <input
                          type="password"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          maxLength="3"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* COD */}
              <motion.button
                onClick={() => setPaymentMethod("cod")}
                whileHover={{ scale: 1.02 }}
                className={`w-full p-6 rounded-xl border-2 transition ${
                  paymentMethod === "cod"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <img
                  src={CODImg}
                  alt="Cash on Delivery"
                  className="h-16 w-full object-contain mb-3"
                />
                <p className="font-semibold text-gray-800">Cash on Delivery</p>
                <p className="text-sm text-gray-600 mt-1">Pay when product arrives</p>
              </motion.button>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Total</h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Items</span>
                  <span>₹{itemsTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-bold" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-bold text-pink-600 mb-8">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>

              <p className="text-xs text-gray-600 mb-4">
                {paymentMethod === "cod"
                  ? "You will pay on delivery"
                  : paymentMethod === "razorpay"
                  ? "Secure payment via Razorpay"
                  : "Payment will be processed securely"}
              </p>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // STEP 4: SUCCESS
  if (step === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-7xl mb-6"
          >
            ✅
          </motion.div>
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Thank you for your purchase
          </p>
          <p className="text-gray-500 mb-8">
            Redirecting to track your order...
          </p>
          <div className="text-3xl font-bold text-pink-600 mb-8">
            ₹{grandTotal.toLocaleString()}
          </div>
          <button
            onClick={() => navigate("/delivery")}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
          >
            View Order Details
          </button>
        </motion.div>
      </motion.div>
    );
  }
};

export default Payment;