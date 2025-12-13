import React from "react";
import { motion } from "framer-motion";
import { Flower2, Gift, Sparkles } from "lucide-react";
import Wed from "../assets/Banner/wed1.jpeg";
import fes from "../assets/Banner/fes1.jpeg";
import dec from "../assets/Banner/dec1.jpeg";


// -------------------------------------------------
// HERO SECTION
// -------------------------------------------------

const Hero = () => {
  return (
    <section className="relative bg-white">
      <div className="mt-10 mb-10 mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-8 lg:px-4">
        
        {/* Image Left */}
        <div className="relative lg:col-span-5 xl:col-span-6 px-4 lg:px-0 mt-6 lg:mt-0 flex justify-center lg:justify-start">
          <img
            className="rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-full h-[350px] sm:h-[450px] lg:h-[500px] xl:h-[520px] object-cover"
            src="https://i.pinimg.com/1200x/1a/2e/ac/1a2eac7746351cafe5dd5ce40ada0371.jpg"
            alt="Flower garland"
          />
        </div>

        {/* Text Right */}
        <div className="flex flex-col justify-center px-4 py-8 sm:py-12 md:py-16 lg:col-span-7 lg:py-24 xl:col-span-6 text-center lg:text-left">
          
          {/* Badge */}
          <div className="inline-flex items-center justify-center lg:justify-start space-x-2 bg-gray-100 rounded-full px-3 py-1">
            <span className="font-mono text-sm font-medium bg-white px-2 rounded-full">
              Fresh Blooms
            </span>
            <span className="font-mono text-sm font-medium text-gray-700">
              Adorn Your Moments →
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-6 sm:mt-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black">
            Grace it. Gift it. Adore it.
            <span className="block font-serif text-pink-400 mt-2">
              Floral Garlands
            </span>
          </h1>

          {/* Paragraph */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-700">
            Celebrate life's beautiful moments with handcrafted{" "}
            <span className="font-semibold text-yellow-400">flower garlands</span>{" "}
            – perfect for weddings, festivals, and decor!
          </p>

          {/* Search Form */}
          <form className="flex flex-col sm:flex-row items-center sm:items-stretch mt-6 sm:mt-8 gap-3 sm:gap-4 justify-center lg:justify-start">
            <input
              type="search"
              placeholder="Search garlands"
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-300 focus:outline-none"
            />
            <button
              type="button"
              className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------
// FEATURED CATEGORIES
// -------------------------------------------------

const FeaturedCategories = () => {
  const categories = [
    {
      icon: (
        <img
          src={Wed}
          alt="Wedding Garlands"
          className="w-30 h-30 rounded-full object-cover shadow-md hover:shadow-2xl transition-shadow duration-300"
        />
      ),
      title: "Wedding Garlands",
      desc: "Traditional & premium wedding collections.",
      color: "from-pink-100 to-white",
    },
    {
      icon: (
        <img
          src={fes}
          alt="Festival Special"
          className="w-30 h-30 b rounded-full object-cover shadow-md hover:shadow-2xl transition-shadow duration-300"
        />
      ),
      title: "Festival Special",
      desc: "Fresh garlands for all celebrations.",
      color: "from-yellow-100 to-white",
    },
    {
      icon: (
        <img
          src={dec}
          alt="Decor Flowers"
          className="w-30 h-30 rounded-full object-cover shadow-md hover:shadow-2xl transition-shadow duration-300"
        />
      ),
      title: "Decor Flowers",
      desc: "Beautify your home & events.",
      color: "from-green-100 to-white",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl text-gray-900">
          <span className="text-3xl md:text-4xl font-bold text-gray-900">
            Popular
          </span>{" "}
          <span className="heading1 text-pink-500">Categories</span>
        </h2>
        <p className="text-gray-600 mt-3">
          Choose the best garlands for your special moments.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-2xl shadow-md bg-gradient-to-br ${cat.color}`}
            >
              <div className="flex justify-center mb-4">{cat.icon}</div>
              <h3 className="heading3 text-xl text-gray-800">
                {cat.title}
              </h3>
              <p className="text-gray-600 mt-2">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------
// TESTIMONIALS
// -------------------------------------------------

const Testimonials = () => {
  const feedback = [
    {
      name: "Priya",
      review:
        "Absolutely loved the quality! Perfect for my wedding ceremony.",
    },
    { name: "Rahul", review: "Fresh flowers and fast delivery. Highly recommended!" },
    {
      name: "Meera",
      review:
        "Beautiful garlands for our festival. Will order again!",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl">
          <span className="text-3xl md:text-4xl font-bold text-gray-900">What Our </span><span className="heading1 text-pink-500">Customers Say</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {feedback.map((f, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.04 }}
              className="p-6 shadow-lg rounded-2xl bg-gray-100"
            >
              <p className="text-gray-700 italic">“{f.review}”</p>
              <h4 className="mt-4 font-semibold text-gray-900">{f.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------
// MAIN HOME PAGE EXPORT
// -------------------------------------------------

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <FeaturedCategories />
      <Testimonials />
      
    </div>
  );
};

export default Home;
