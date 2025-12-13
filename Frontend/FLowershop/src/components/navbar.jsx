import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faBagShopping,
  faComments,
  faTruck,
  faChartPie,
  faBars,
  faXmark,
  faSearch,
  faUser,
  faUserShield,
  faRightFromBracket,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FaHeart } from "react-icons/fa";
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";
import { useAuth } from "../Context/AuthContext";

export default function Navbar() {
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [garlandOpen, setgarlandOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const garlandRef = useRef();
  const dashboardRef = useRef();

  // SEARCH STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef(null);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // 🔥 Debounced search API
  const fetchSuggestions = (value) => {
    setSearchTerm(value);
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      if (value.trim() === "") {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/live-search/?q=${value}`
        );
        const data = await res.json();
        setSuggestions(data);
        setShowDropdown(true);
        setActiveIndex(-1);
      } catch (err) {
        console.log("Search failed:", err);
      }
    }, 300);
  };

  // 🔥 Keyboard Navigation
  const handleDropdownNavigation = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      const item = suggestions[activeIndex];
      navigate(`/product/${item.id}`);
      setShowDropdown(false);
    }
  };

  // 🔥 Highlight text
  const highlightText = (name) => {
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return name.replace(
      regex,
      "<mark class='bg-yellow-200 text-black'>$1</mark>"
    );
  };

  const garland = [
    { name: "Rose Petal", path: "/category/Rosepetal" },
    { name: "Lotus", path: "/category/Lotus" },
    { name: "Sammangi", path: "/category/Sammangi" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        garlandRef.current &&
        !garlandRef.current.contains(e.target) &&
        dashboardRef.current &&
        !dashboardRef.current.contains(e.target)
      ) {
        setgarlandOpen(false);
        setDashboardOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Section */}
      <div className="flex justify-between items-center px-5 py-3 border-b">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-xs text-gray-500 font-mono">
            {new Date().toUTCString().slice(0, 16)}
          </span>
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400">
            Hari Flower Shop
          </span>
        </Link>

        {/* 🔥 SEARCH BAR WITH AUTOCOMPLETE */}
        <div className="hidden lg:flex flex-col relative w-1/3">
          <div className="flex items-center border rounded-full px-3 py-1.5 bg-gray-50">
            <FontAwesomeIcon icon={faSearch} className="text-gray-500 mr-2" />

            <input
              type="text"
              placeholder="Search flowers, garlands..."
              className="w-full bg-transparent outline-none text-sm"
              value={searchTerm}
              onChange={(e) => fetchSuggestions(e.target.value)}
              onKeyDown={handleDropdownNavigation}
              onFocus={() =>
                suggestions.length > 0 && setShowDropdown(true)
              }
            />
          </div>

          {/* Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">

              {suggestions.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className={`flex items-center gap-1 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer 
                    ${index === activeIndex ? "bg-gray-200" : ""}
                  `}
                  onClick={() => {
                    setSearchTerm("");
                    setSuggestions([]);
                    setShowDropdown(false);
                  }}
                >
                  {/* Image removed */}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlightText(item.name),
                    }}
                  ></span>
                </Link>
              ))}

            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-pink-500">
            <FontAwesomeIcon icon={faBagShopping} size="xl" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <Link to="/wishlist" className="relative text-pink-500">
            <FaHeart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/contact" className="text-orange-400 hover:text-pink-500">
            <FontAwesomeIcon icon={faComments} size="lg" />
          </Link>

          <NavLink to="/delivery" className="text-orange-400 hover:text-pink-600 transition">
            <FontAwesomeIcon icon={faTruck} size="lg" />
          </NavLink>

          {/* Dashboard Dropdown */}
          <div className="hidden lg:block relative" ref={dashboardRef}>
            <button
              onClick={() => setDashboardOpen(!dashboardOpen)}
              className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-pink-50 text-gray-700"
            >
              <FontAwesomeIcon icon={faChartPie} />
              Dashboard
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`transition-transform ${dashboardOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            <ul
              className={`absolute right-0 bg-white shadow-xl z-[9999] rounded-xl mt-2 border w-52 backdrop-blur-xl transition-all duration-200 ${dashboardOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
                }`}
            >
              {!isAuthenticated && (
                <li>
                  <Link to="/signin" className="block px-4 py-2 hover:bg-pink-50">
                    <FontAwesomeIcon icon={faRightToBracket} size="10" />
                    Login First
                  </Link>
                </li>
              )}

              {isAuthenticated && (
                <li>
                  <Link
                    to="/user/dashboard"
                    onClick={() => setDashboardOpen(false)}
                    className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600"
                  >
                    <FontAwesomeIcon icon={faUser} size="10" />
                    User Dashboard
                  </Link>
                </li>
              )}

              {isAuthenticated && user?.is_admin && (
                <li>
                  <Link
                    to="/admin/overview"
                    onClick={() => setDashboardOpen(false)}
                    className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600"
                  >
                    <FontAwesomeIcon icon={faUserShield} size="10" />
                    Admin Dashboard
                  </Link>
                </li>
              )}

              {isAuthenticated && (
                <li>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-500"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} size="10" />
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Login Button */}
          {!isAuthenticated ? (
            <Link
              to="/signin"
              className="hidden lg:inline-block bg-gradient-to-r from-pink-500 to-orange-400 text-white px-5 py-1.5 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className="hidden lg:inline-block bg-red-500 text-white px-5 py-1.5 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
            >
              Logout
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-2xl text-pink-600"
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
          </button>
        </div>
      </div>

      {/* Desktop Links */}
      <div className="hidden lg:flex justify-center items-center gap-6 py-2 text-gray-700 font-medium border-t">
        <Link to="/" className="hover:text-pink-600">Home</Link>
        <Link to="/about" className="hover:text-pink-600">About Us</Link>
        <Link to="/products" className="hover:text-pink-600">All Products</Link>
        <Link to="/category/bouquets" className="hover:text-pink-600">Bouquets</Link>
        <Link to="/category/dry-fruit-garland" className="hover:text-pink-600">Dry Fruit Garland</Link>
        <Link to="/category/money-garland" className="hover:text-pink-600">Money Garland</Link>
        <Link to="/category/aaram" className="hover:text-pink-600">Aaram</Link>
        <Link to="/category/decoration" className="hover:text-pink-600">Decorations</Link>

        {/* Garland Dropdown */}
        <div className="relative" ref={garlandRef}>
          <button
            onClick={() => setgarlandOpen(!garlandOpen)}
            className="flex items-center hover:text-pink-600"
          >
            Garland
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`ml-1 transition-transform ${garlandOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          <ul
            className={`absolute bg-white shadow-xl z-[9999] rounded-xl mt-2 w-48 border backdrop-blur-xl transition-all duration-300 ${garlandOpen
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            {garland.map((p) => (
              <li key={p.path}>
                <Link
                  to={p.path}
                  className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-600"
                  onClick={() => setgarlandOpen(false)}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col gap-3 bg-white px-6 py-4 border-t text-gray-700">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/category/bouquets" onClick={() => setMenuOpen(false)}>Bouquets</Link>
          <Link to="/category/dry-fruit-garland" onClick={() => setMenuOpen(false)}>Dry Fruit Garland</Link>
          <Link to="/category/money-garland" onClick={() => setMenuOpen(false)}>Money Garland</Link>
          <Link to="/category/chocolate-garland" onClick={() => setMenuOpen(false)}>Chocolate Garland</Link>
          <Link to="/category/decoration" onClick={() => setMenuOpen(false)}>Decorations</Link>

          <details className="group">
            <summary className="cursor-pointer text-pink-600 font-medium">
              Garland
            </summary>

            <ul className="ml-4 mt-2 space-y-2">
              {garland.map((p) => (
                <li key={p.path}>
                  <Link
                    to={p.path}
                    onClick={() => setMenuOpen(false)}
                    className="block text-gray-700 hover:text-pink-600"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          <details>
            <summary className="cursor-pointer text-pink-600 font-medium">
              Dashboard
            </summary>

            <ul className="ml-4 mt-1 space-y-2">
              {!isAuthenticated && (
                <li>
                  <Link
                    to="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 hover:text-pink-600"
                  >
                    <FontAwesomeIcon icon={faRightToBracket} />
                    Login First
                  </Link>
                </li>
              )}

              {isAuthenticated && (
                <li>
                  <Link
                    to="/user/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 hover:text-pink-600"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    User Dashboard
                  </Link>
                </li>
              )}

              {isAuthenticated && user?.is_admin && (
                <li>
                  <Link
                    to="/admin/overview"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 hover:text-pink-600"
                  >
                    <FontAwesomeIcon icon={faUserShield} />
                    Admin Dashboard
                  </Link>
                </li>
              )}

              {isAuthenticated && (
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </details>
        </div>
      )}
    </nav>
  );
}
