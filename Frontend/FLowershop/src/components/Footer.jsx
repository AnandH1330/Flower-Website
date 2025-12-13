import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-pink-100 text-gray-800 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">

          {/* About */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400">Hari Flower Shop</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Address: Near Old Bus Stand, Theni, Tamil Nadu – 625531
            </p>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Products</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>
                <Link to="/products" className="hover:text-pink-500 transition-colors cursor-pointer">All Product</Link>
              </li>
              <li>
                <Link to="/decoration" className="hover:text-pink-500 transition-colors cursor-pointer">Decoration</Link>
              </li>
              <li>
                <Link to="/bouquets" className="hover:text-pink-500 transition-colors cursor-pointer">Bouquets</Link>
              </li>
              {/* <li>
                <Link to="pages/Petals/Lotus" className="hover:text-pink-500 transition-colors cursor-pointer">Petals</Link>
              </li> */}
              <li>
                <Link to="/moneyarts" className="hover:text-pink-500 transition-colors cursor-pointer">Money Arts</Link>
              </li>
              <li>
                <Link to="/dryfruitsmala" className="hover:text-pink-500 transition-colors cursor-pointer">Dry Fruits Arts</Link>
              </li>
              {/* <li>
                <Link to="/ChocolateMala" className="hover:text-pink-500 transition-colors cursor-pointer">Chocolate Arts</Link>
              </li> */}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-700 text-sm">

              <li>
                <Link to="/about" className="hover:text-pink-500 transition-colors cursor-pointer">About</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-pink-500 transition-colors cursor-pointer">Contact</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-pink-500 transition-colors cursor-pointer">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-700 text-sm">Email: support@hariflowershop.com</p>
            <p className="text-gray-700 text-sm">Phone: +91 63815 01330</p>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <a href="https://www.facebook.com/" className="hover:text-pink-500 transition-colors">
                <Facebook size={20} />
              </a>
              {/* <a href="#" className="hover:text-pink-500 transition-colors">
                <Twitter size={20} />
              </a> */}
              <a href="https://www.instagram.com/" className="hover:text-pink-500 transition-colors">
                <Instagram size={20} />
              </a>
              {/* <a href="#" className="hover:text-pink-500 transition-colors">
                <Linkedin size={20} />
              </a> */}
            </div>
          </div>

        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-gray-300 pt-6 text-center text-gray-700 text-xs md:text-sm">
          &copy; {new Date().getFullYear()} Hari Flower Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
