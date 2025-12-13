
// import axiosInstance from "../Api/axiosInstance";
// import { FaFacebook, FaXTwitter, FaInstagram } from "react-icons/fa6";
// import { useRef, useState } from "react";

// const Contact = () => {
//   const contactRef = useRef(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const formData = {
//       name: e.target.name.value,
//       email: e.target.email.value,
//       message: e.target.message.value,
//     };

//     try {
//       const response = await axiosInstance.post("contact/submit/", formData);
//       if (response.status === 201) {
//         setSubmitted(true);
//         e.target.reset();
//         setTimeout(() => setSubmitted(false), 5000);
//       }
//     } catch (err) {
//       console.error("Error:", err.response?.data || err.message);
//       setError("Failed to send message. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       id="contact"
//       ref={contactRef}
//       className="relative min-h-screen bg-gray-50 flex justify-center py-10 px-4"
//     >
//       {/* Decorative floating circles */}
//       <div className="absolute -top-32 -left-32 w-64 h-64 bg-pink-300 rounded-full opacity-50 animate-pulse blur-3xl"></div>
//       <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-orange-300 rounded-full opacity-40 animate-pulse blur-3xl"></div>

//       {/* Main container */}
//       <div className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
//         {/* Left Illustration / Info */}
//         <div className="md:w-1/2 bg-gradient-to-tr from-pink-200 via-orange-200 to-yellow-100 flex flex-col items-center justify-center p-10">
//           <h2 className="text-5xl font-bold text-pink-600 mb-4 text-center md:text-left">
//             Get in Touch
//           </h2>

//           {/* Social Icons */}
//           <div className="flex space-x-6 mt-4">
//             <FaFacebook
//               size={40}
//               className="text-[#1877F2] transform hover:scale-125 hover:-rotate-12 transition duration-300 cursor-pointer"
//             />
//             <FaInstagram
//               size={40}
//               className="text-[#E1306C] transform hover:scale-125 hover:rotate-12 transition duration-300 cursor-pointer"
//             />
//             <FaXTwitter
//               size={40}
//               className="text-black transform hover:scale-125 hover:rotate-12 transition duration-300 cursor-pointer"
//             />
//           </div>
//         </div>

//         {/* Right Contact Form */}
//         <div className="md:w-1/2 p-10 bg-white flex flex-col justify-center">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {/* Name Input */}
//             <div className="relative">
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 placeholder="Full Name"
//                 required
//                 className="w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 peer"
//               />
//               <label
//                 htmlFor="name"
//                 className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-pink-500 peer-focus:text-sm"
//               >
//                 Full Name
//               </label>
//             </div>

//             {/* Email Input */}
//             <div className="relative">
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 placeholder="Email Address"
//                 required
//                 className="w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 peer"
//               />
//               <label
//                 htmlFor="email"
//                 className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-pink-500 peer-focus:text-sm"
//               >
//                 Email Address
//               </label>
//             </div>

//             {/* Message Input */}
//             <div className="relative">
//               <textarea
//                 id="message"
//                 name="message"
//                 rows="4"
//                 placeholder="Your Message"
//                 required
//                 className="w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 peer"
//               ></textarea>
//               <label
//                 htmlFor="message"
//                 className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-pink-500 peer-focus:text-sm"
//               >
//                 Your Message
//               </label>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? "Sending..." : "Send Message →"}
//             </button>

//             {/* Success & Error Messages */}
//             {submitted && (
//               <p className="mt-4 text-center text-green-600 font-medium animate-pulse">
//                 🎉 Your message has been sent successfully!
//               </p>
//             )}
//             {error && (
//               <p className="mt-4 text-center text-red-600 font-medium">
//                 {error}
//               </p>
//             )}
//           </form>
//         </div>
//       </div>

//       {/* WhatsApp Floating Button */}
//       <a
//         href="https://wa.me/919876543210?text=Hello%20SS%20Flower%20Shop!"
//         target="_blank"
//         rel="noopener noreferrer"
//         className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 animate-bounce transition-transform"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-8 w-8"
//           viewBox="0 0 24 24"
//           fill="currentColor"
//         >
//           <path d="M20.52 3.48A11.99 11.99 0 0012 0C5.37 0 0 5.37 0 12a11.98 11.98 0 001.72 6.08L0 24l5.92-1.66A11.99 11.99 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.26-6.21-3.48-8.52zM12 22c-2.03 0-3.91-.61-5.5-1.65l-.39-.26-3.51.98.94-3.41-.26-.4A9.97 9.97 0 012 12c0-5.52 4.48-10 10-10 5.52 0 10 4.48 10 10s-4.48 10-10 10zm5.38-7.96c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15s-.78.97-.95 1.17c-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.51-1.78-1.69-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.28.3-.47.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.48-.5-.68-.51-.17-.01-.37-.01-.57-.01s-.52.07-.79.37c-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.21 3.05c.15.2 2.09 3.2 5.07 4.49.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35z" />
//         </svg>
//       </a>
//     </div>
//   );
// };

// export default Contact;



import API from "../Api/axiosInstance";
import { FaFacebook, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { useRef, useState } from "react";

const Contact = () => {
  const contactRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      const response = await API.post("contact/submit/", formData);
      console.log("Response:", response);
      if (response.status === 201) {
        setSubmitted(true);
        e.target.reset();
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      console.error("Full Error:", err);
      console.error("Error Response:", err.response);
      console.error("Error Data:", err.response?.data);
      setError(err.response?.data?.detail || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="contact"
      ref={contactRef}
      className="relative min-h-screen bg-gray-50 flex justify-center py-10 px-4"
    >
      {/* Decorative floating circles */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-pink-300 rounded-full opacity-50 animate-pulse blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-orange-300 rounded-full opacity-40 animate-pulse blur-3xl"></div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Illustration / Info */}
        <div className="md:w-1/2 bg-gradient-to-tr from-pink-200 via-orange-200 to-yellow-100 flex flex-col items-center justify-center p-10">
          <h2 className="text-5xl font-bold text-pink-600 mb-4 text-center md:text-left">
            Get in Touch
          </h2>

          {/* Social Icons */}
          <div className="flex space-x-6 mt-4">
            <FaFacebook
              size={40}
              className="text-[#1877F2] transform hover:scale-125 hover:-rotate-12 transition duration-300 cursor-pointer"
            />
            <FaInstagram
              size={40}
              className="text-[#E1306C] transform hover:scale-125 hover:rotate-12 transition duration-300 cursor-pointer"
            />
            <FaXTwitter
              size={40}
              className="text-black transform hover:scale-125 hover:rotate-12 transition duration-300 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="md:w-1/2 p-10 bg-white flex flex-col justify-center">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                required
                className="w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 peer"
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-pink-500 peer-focus:text-sm"
              >
                Full Name
              </label>
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 peer"
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-pink-500 peer-focus:text-sm"
              >
                Email Address
              </label>
            </div>

            {/* Message Input */}
            <div className="relative">
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="Your Message"
                required
                className="w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 peer"
              ></textarea>
              <label
                htmlFor="message"
                className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-pink-500 peer-focus:text-sm"
              >
                Your Message
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message →"}
            </button>

            {/* Success & Error Messages */}
            {submitted && (
              <p className="mt-4 text-center text-green-600 font-medium animate-pulse">
                🎉 Your message has been sent successfully!
              </p>
            )}
            {error && (
              <p className="mt-4 text-center text-red-600 font-medium">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919876543210?text=Hello%20SS%20Flower%20Shop!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 animate-bounce transition-transform"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20.52 3.48A11.99 11.99 0 0012 0C5.37 0 0 5.37 0 12a11.98 11.98 0 001.72 6.08L0 24l5.92-1.66A11.99 11.99 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.26-6.21-3.48-8.52zM12 22c-2.03 0-3.91-.61-5.5-1.65l-.39-.26-3.51.98.94-3.41-.26-.4A9.97 9.97 0 012 12c0-5.52 4.48-10 10-10 5.52 0 10 4.48 10 10s-4.48 10-10 10zm5.38-7.96c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15s-.78.97-.95 1.17c-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.51-1.78-1.69-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.28.3-.47.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.48-.5-.68-.51-.17-.01-.37-.01-.57-.01s-.52.07-.79.37c-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.21 3.05c.15.2 2.09 3.2 5.07 4.49.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35z" />
        </svg>
      </a>
    </div>
  );
};

export default Contact;