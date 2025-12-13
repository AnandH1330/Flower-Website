import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./Context/CartContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Wishlist from "./pages/Wishlist";

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";

import Addresses from "./components/Addresses";
import AddressDetails from "./components/AddressDetails";

import SearchResults from "./pages/SearchResults.jsx";

// Pages
import Home from "./pages/home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/contact us.jsx";
import Payment from "./pages/Payment.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./components/SignIn.jsx";
import Delivery from "./pages/Delivery.jsx";

// Components
import BannerSlider from "./components/Banner.jsx";
import Homelist from "./components/homelist.jsx";
import InstagramAndVideo from "./components/InstagramAndVideo.jsx";
import Cart from "./components/CartPageTemp.jsx";

// Product Pages
import CategoryProducts from "./pages/CategoryProducts";
import Decor from "./pages/Products/Decoration.jsx";
import Bouquets from "./pages/Products/Bouquets.jsx";
import MoneyArts from "./pages/Products/MoneyArts.jsx";
import Aaram from "./pages/Products/Aaram.jsx";
import DryFruitsMala from "./pages/Products/DryFruitsMala.jsx";
import Flowers from "./pages/Products/Flowers.jsx";
import Rosepetal from "./pages/Products/Rosepetal.jsx";
import Lotus from "./pages/Products/Lotus.jsx";
import Sammangi from "./pages/Products/Sammangi.jsx";

// Admin Pages
import AdminProducts from "./admin/pages/products/AdminProducts";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminOverview from "./admin/pages/Overview.jsx";
import AdminUsers from "./admin/pages/Users.jsx";
import AdminCategories from "./admin/pages/Categories.jsx";
import AdminOrders from "./admin/pages/Orders.jsx";
import AdminCoupons from "./admin/pages/Coupons.jsx";
import AdminReports from "./admin/pages/Reports.jsx";
import AdminNotifications from "./admin/pages/Notifications.jsx";
import AdminSettings from "./admin/pages/Settings.jsx";
import UserProfile from "./admin/pages/UserProfile.jsx";
import AdminContacts from "./admin/pages/Contacts.jsx";

// User Dashboard
import UserDashboard from "./User/UserDashboard";
import AllProducts from "./pages/Products/AllProducts.jsx";

import ProductDetail from "./pages/ProductDetail.jsx";


function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <CartProvider>
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          {/* AUTH */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <Home />
                <BannerSlider />
                <InstagramAndVideo />
                <Homelist />
              </>
            }
          />

          {/* COMMON PAGES */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />

          {/* PRODUCTS */}
          <Route path="/products" element={<AllProducts />} />
          <Route path="/category/:slug" element={<CategoryProducts />} />
          <Route path="/flowers" element={<><BannerSlider /><Flowers /></>} />
          <Route path="/decoration" element={<><BannerSlider /><Decor /></>} />
          <Route path="/bouquets" element={<><BannerSlider /><Bouquets /></>} />
          <Route path="/moneyarts" element={<><BannerSlider /><MoneyArts /></>} />
          <Route path="/aaram" element={<><BannerSlider /><Aaram /></>} />
          <Route path="/dryfruitsmala" element={<><BannerSlider /><DryFruitsMala /></>} />
          <Route path="/rosepetals" element={<><BannerSlider /><Rosepetal /></>} />
          <Route path="/lotus" element={<><BannerSlider /><Lotus /></>} />
          <Route path="/sammangi" element={<><BannerSlider /><Sammangi /></>} />


          {/* ADMIN ROUTES (PROTECTED) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="overview" element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
          
          {/* Delivery */}
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/track-order" element={<Delivery />} /> 

          {/* USER DASHBOARD (PROTECTED) */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* ADDRESSES */}
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/addresses/:id" element={<AddressDetails />} />

          {/* WISHLIST */}
          <Route path="/wishlist" element={<Wishlist />} />

          {/* SEARCH RESULTS */}
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </CartProvider>
      <WhatsAppButton />
      <Footer />
    </>
  );
}

export default App;
