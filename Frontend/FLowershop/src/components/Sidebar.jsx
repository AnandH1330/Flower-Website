// // src/components/Sidebar.jsx
// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FiMenu, FiX, FiShoppingCart, FiHome, FiGift, FiPhone } from "react-icons/fi";

// const Sidebar = () => {
//   const [open, setOpen] = useState(false);
//   const location = useLocation();

//   const navLinks = [
//     { name: "Home", path: "/", icon: <FiHome /> },
//     { name: "Decorations", path: "/decor", icon: <FiGift /> },
//     { name: "Cart", path: "/cart", icon: <FiShoppingCart /> },
//     { name: "Contact", path: "/contact", icon: <FiPhone /> },
//   ];

//   return (
//     <div className="">
//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-full bg-gradient-to-b from-pink-500 to-orange-800 text-white w-64 p-5 transform ${
//           open ? "translate-x-0" : "-translate-x-full"
//         } transition-transform duration-300 z-40 md:translate-x-0 md:static md:w-64`}
//       >
//         <h2 className="text-2xl font-bold mb-8 text-center">🌸 Flower Shop</h2>
//         <ul className="space-y-4">
//           {navLinks.map((link) => (
//             <li key={link.path}>
//               <Link
//                 to={link.path}
//                 onClick={() => setOpen(false)}
//                 className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
//                   location.pathname === link.path
//                     ? "bg-white text-pink-600 font-semibold"
//                     : "hover:bg-white/20"
//                 }`}
//               >
//                 {link.icon}
//                 {link.name}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Overlay for mobile */}
//       {open && (
//         <div
//           onClick={() => setOpen(false)}
//           className="fixed inset-0 bg-black/40 z-30 md:hidden"
//         ></div>
//       )}

//       {/* Hamburger button (mobile only) */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="fixed top-4 left-4 text-pink-600 z-50 md:hidden bg-white rounded-full p-2 shadow"
//       >
//         {open ? <FiX size={24} /> : <FiMenu size={24} />}
//       </button>
//     </div>
//   );
// };

// export default Sidebar;
