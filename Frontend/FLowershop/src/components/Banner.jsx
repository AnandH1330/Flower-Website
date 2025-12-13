import React, { useState, useEffect } from "react";
import Banner1 from "../assets/Banner/banner1.webp";
import Banner2 from "../assets/Banner/banner2.webp";
import Banner5 from "../assets/Banner/banner5.webp";
import Banner6 from "../assets/Banner/banner6.png";

const BannerSlider = () => {
  const banners = [Banner1, Banner2, Banner5, Banner6];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % banners.length), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-5 relative w-full h-[150px] sm:h-[350px] md:h-[250px] rounded-2xl overflow-hidden shadow-lg">
      {banners.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Banner ${idx}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        />
      ))}

      {/* Navigation */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-500 bg-opacity-50 text-black px-3 py-2 rounded-full hover:bg-opacity-80 transition"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-500 bg-opacity-50 text-black px-3 py-2 rounded-full hover:bg-opacity-80 transition"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {banners.map((_, idx) => (
          <span key={idx} className={`w-3 h-3 rounded-full ${current === idx ? "bg-yellow-400" : "bg-gray-300"}`}></span>
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
