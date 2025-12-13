import React from "react";
import qr from "../assets/moves.png";
import bannerVideo from "../assets/Banner/Welcome.mp4";

const InstagramAndVideo = () => {
  return (
    <section className="bg-pink-50 flex flex-col lg:flex-row items-center justify-between overflow-hidden min-h-[400px] lg:min-h-[500px]">

      {/* Left Side — Centered Video Banner */}
      <div className="relative flex items-center justify-center w-full lg:w-1/2 h-[300px] sm:h-[400px] lg:h-auto ">
        <video
          className="w-[90%] lg:w-[80%] rounded-xl object-cover shadow-lg"
          src={bannerVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Optional overlay button removed for clean centering */}
      </div>

      {/* Right Side — Centered Instagram Section */}
      <div className="w-full lg:w-1/2 py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
        {/* <h2 className="text-5xl block font-serif text-pink-400 mt-2">
          Follow Us on Instagram 🌷
        </h2>
        <p className="text-gray-600 max-w-md">
          Stay updated with our latest floral arrangements, sales, and events!
        </p> */}

        <div className="flex flex-col items-center gap-4">
          <img
            src={qr}
            alt="Instagram QR Code"
            className="w-90 h-110 rounded-lg shadow-md"
          />
          {/* <a
            href="https://instagram.com/your_instagram_id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-pink-600 hover:bg-pink-700 px-6 py-2 rounded-full font-medium shadow-md transition-transform duration-300 hover:scale-105"
          >
            Visit Our Instagram
          </a> */}
        </div>
      </div>
    </section>
  );
};

export default InstagramAndVideo;
