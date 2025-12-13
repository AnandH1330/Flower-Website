import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import axiosInstance from "../api/axiosInstance";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const TrackOrderMap = ({ trackingId }) => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`orders/${trackingId}/`);
        setOrder(res.data);
      } catch (err) {
        setError("Order not found or invalid tracking ID.");
      } finally {
        setLoading(false);
      }
    };

    if (trackingId) fetchOrder();
  }, [trackingId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!order.latitude || !order.longitude) return <p>Location not available</p>;

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <h2>Order #{order.id}</h2>
      <p>Status: {order.status}</p>
      <p>Payment Method: {order.payment_method}</p>

      <GoogleMap