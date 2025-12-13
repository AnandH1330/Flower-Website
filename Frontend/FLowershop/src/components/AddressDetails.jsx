// src/components/AddressDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const AddressDetails = () => {
  const { id } = useParams(); // Get the address ID from the URL
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/addresses/${id}/`)
      .then((res) => {
        setAddress(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch address details:", err);
        setError("Failed to load address details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading address details...</p>;
  if (error) return <p>{error}</p>;
  if (!address) return <p>Address not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Address Details</h2>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          maxWidth: "400px",
          boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3>{address.name}</h3>
        <p>
          <strong>Street:</strong> {address.street}
        </p>
        <p>
          <strong>City:</strong> {address.city}
        </p>
        <p>
          <strong>State:</strong> {address.state}
        </p>
        <p>
          <strong>Zipcode:</strong> {address.zipcode}
        </p>
      </div>
      <Link to="/addresses" style={{ marginTop: "20px", display: "inline-block", color: "#007bff" }}>
        ← Back to Addresses
      </Link>
    </div>
  );
};

export default AddressDetails;
