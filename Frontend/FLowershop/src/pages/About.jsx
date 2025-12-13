// import React from "react";
import { motion } from "framer-motion";
import {
  Flower2,
  Heart,
  Sparkles,
  CheckCircle,
  Truck,
  CreditCard,
  BadgeCheck,
} from "lucide-react";
import Abimg from "../assets/Banner/Indian illustration.jpeg";
import Temple1 from "../assets/Banner/nanthi.jpeg";

export default function About() {
  const content = {
    companyHistory:
      "Hari Flower Shop began as a small home garden that blossomed into a trusted floral brand loved by thousands. What started as a simple passion for growing flowers slowly turned into a dream of delivering happiness to people’s doorsteps. Our journey is built on dedication, creativity, and a deep belief that every flower carries a message of love, purity, and emotion. Over the years, we have grown from handpicking fresh flowers every morning to crafting premium bouquets, temple malas, bridal collections, décor arrangements, and custom floral designs for every occasion. Every bloom we create carries a piece of our heart and our commitment to quality.",
    mission:
      "To deliver the freshest, most beautiful flowers that brighten your special moments and spread happiness. Our mission is to create floral experiences that stay in your memory—whether it’s a birthday, festival, temple offering, celebration, or a simple gesture of love. We believe flowers speak a language beyond words, and our aim is to help your emotions reach your loved ones beautifully, gracefully, and on time.",
    vision:
      "To become the most loved and trusted flower brand, known for quality, creativity, and reliability. We aspire to bring natural beauty into every home and to make floral gifting a delightful, effortless experience. Our long-term vision is to expand our services, introduce unique floral concepts, and continue spreading joy through the art of flowers.",
    values: [
      "Freshness Guaranteed",
      "Customer First",
      "Creativity in Every Bouquet",
      "Quality & Trust",
    ],
  };

  return (
    <div className="container mx-auto px-4 py-10 ">

      {/* HEADER */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400 text-transparent">
          Hari Flower Shop
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Fresh flowers crafted with love to make every moment beautiful.
        </p>
      </motion.section>

      {/* STORY SECTION */}
      <section className="grid lg:grid-cols-2 gap-10 items-center mb-16">

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
            <Flower2 size={32} /> Our Story
          </h2>

          <p className="text-gray-700 font-bold leading-relaxed text-lg">
            {content.companyHistory}
          </p>
        </motion.div>

        {/* Image */}
        <motion.img
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          src={Abimg}
          alt="Flower Shop"
          className="rounded-3xl shadow-xl w-[600px] h-[550px] object-cover mx-auto"
        />
      </section>

      {/* POEM SECTION */}
      <section className="grid lg:grid-cols-2 gap-10 items-center mb-16">

        {/* Image LEFT */}
        <motion.img
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          src={Temple1}
          alt="Flower Shop"
          className="rounded-3xl shadow-xl w-[600px] h-[550px] object-fix mx-auto"
        />

        {/* Text RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
            <Flower2 size={32} /> Divine Lines
          </h2>

          <p className="text-gray-700 font-bold leading-relaxed text-lg">
            “Every petal has a story, every prayer carries a light.  
            When devotion meets beauty, the heart opens and life becomes bright.  
            Flowers don’t just decorate—they bless, purify, and uplift the soul.  
            In every blossom, there is calmness, divinity, and a gentle connection to the divine.”
          </p>
        </motion.div>

      </section>

      {/* MISSION & VISION */}
      <section className="grid md:grid-cols-2 gap-8 mb-16">

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-pink-50 to-white border"
        >
          <h3 className="text-2xl font-semibold text-pink-600 mb-3 flex items-center gap-2">
            <Heart size={28} /> Our Mission
          </h3>
          <p className="text-gray-700 font-bold leading-relaxed">
            {content.mission}
          </p>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-pink-50 to-white border"
        >
          <h3 className="text-2xl font-semibold text-pink-600 mb-3 flex items-center gap-2">
            <Sparkles size={28} /> Our Vision
          </h3>
          <p className="text-gray-700 font-bold leading-relaxed">
            {content.vision}
          </p>
        </motion.div>
      </section>

      {/* VALUES */}
      <section className="mb-16">
        <h3 className="text-3xl font-semibold text-pink-600 mb-6">
          Our Core Values
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {content.values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-4 bg-white border rounded-2xl shadow-md text-center hover:shadow-xl transition duration-300"
            >
              <CheckCircle className="text-pink-500 mx-auto mb-2" size={32} />
              <p className="text-gray-700 font-semibold">{value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mb-16">
        <h3 className="text-3xl font-semibold text-pink-600 mb-6">
          Why Choose Hari Flower Shop?
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white border rounded-3xl shadow-lg"
          >
            <Flower2 size={34} className="text-pink-500 mb-4" />
            <h4 className="text-lg font-bold text-gray-800">Fresh Flowers Daily</h4>
            <p className="text-gray-600 mt-2">
              We source flowers directly from trusted farms, ensuring freshness that lasts longer and enhances every celebration you create.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white border rounded-3xl shadow-lg"
          >
            <Heart size={34} className="text-pink-500 mb-4" />
            <h4 className="text-lg font-bold text-gray-800">Handcrafted Bouquets</h4>
            <p className="text-gray-600 mt-2">
              Our florists handcraft each bouquet with love, detail, and creativity, ensuring your gift is truly one-of-a-kind.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white border rounded-3xl shadow-lg"
          >
            <BadgeCheck size={34} className="text-pink-500 mb-4" />
            <h4 className="text-lg font-bold text-gray-800">Quality & Reliability</h4>
            <p className="text-gray-600 mt-2">
              Premium quality, reliable service, and timely delivery — your trust is our priority.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PAYMENT & DELIVERY */}
      <section className="mb-10">
        <h3 className="text-3xl font-semibold text-pink-600 mb-6">
          Payment & Delivery Information
        </h3>

        <div className="grid md:grid-cols-3 gap-8">

          {/* PAYMENT */}
          <div className="p-6 bg-white border rounded-3xl shadow-lg">
            <CreditCard size={32} className="text-pink-500 mb-3" />
            <h4 className="font-bold text-gray-800 mb-2">Payment Options</h4>
            <ul className="text-gray-600 leading-relaxed">
              <li>UPI (GPay / PhonePe / Paytm)</li>
              <li>Debit & Credit Cards</li>
              <li>Cash on Delivery</li>
              <li>Net Banking</li>
            </ul>
          </div>

          {/* DELIVERY */}
          <div className="p-6 bg-white border rounded-3xl shadow-lg">
            <Truck size={32} className="text-pink-500 mb-3" />
            <h4 className="font-bold text-gray-800 mb-2">Fast Delivery</h4>
            <p className="text-gray-600">
              Same-day delivery available. Your flowers reach fresh, fast, and beautifully packed.
            </p>
          </div>

          {/* RETURNS */}
          <div className="p-6 bg-white border rounded-3xl shadow-lg">
            <BadgeCheck size={32} className="text-pink-500 mb-3" />
            <h4 className="font-bold text-gray-800 mb-2">Trusted Quality</h4>
            <p className="text-gray-600">
              We ensure every bouquet meets our quality standards. Your satisfaction matters most.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
