// // src/components/Addresses.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Addresses = () => {
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Replace this URL with your actual backend endpoint
//     axios
//       .get("http://127.0.0.1:8000/api/addresses/")
//       .then((res) => {
//         setAddresses(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Address fetch failed:", err);
//         setError("Failed to fetch addresses");
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p>Loading addresses...</p>;
//   if (error) return <p>{error}</p>;
//   if (addresses.length === 0) return <p>No addresses found.</p>;

//   return (
//     <div>
//       <h2>Addresses</h2>
//       <ul>
//         {addresses.map((address) => (
//           <li key={address.id}>
//             {address.name}, {address.street}, {address.city}, {address.zipcode}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Addresses;


// src/components/Addresses.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/addresses/")
      .then((res) => {
        setAddresses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Address fetch failed:", err);
        setError("Failed to fetch addresses.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading addresses...</p>;
  if (error) return <p>{error}</p>;
  if (addresses.length === 0) return <p>No addresses found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Addresses</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {addresses.map((address) => (
          <div
            key={address.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              width: "250px",
              boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{address.name}</h3>
            <p>{address.street}</p>
            <p>
              {address.city}, {address.state} {address.zipcode}
            </p>
            <Link
              to={`/addresses/${address.id}`}
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;
