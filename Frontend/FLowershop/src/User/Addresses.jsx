import { useState, useEffect } from "react";
import axiosInstance from "../Api/axiosInstance";

const emptyForm = {
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  is_default: false,
};

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAddresses = () => {
    setLoading(true);
    axiosInstance
      .get("addresses/")
      .then((res) => setAddresses(res.data))
      .catch(() => setError("Unable to load addresses"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await axiosInstance.post("addresses/", form);
      setForm(emptyForm);
      fetchAddresses();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to save address. Please check the fields."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await axiosInstance.delete(`addresses/${id}/`);
      fetchAddresses();
    } catch {
      setError("Unable to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    await axiosInstance.patch(`addresses/${id}/`, { is_default: true });
    fetchAddresses();
  };

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address Line 1
            </label>
            <input
              name="address_line1"
              value={form.address_line1}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address Line 2
            </label>
            <input
              name="address_line2"
              value={form.address_line2}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pincode
              </label>
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Landmark (optional)
              </label>
              <input
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="is_default"
              checked={form.is_default}
              onChange={handleChange}
            />
            Set as default shipping address
          </label>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-pink-600 text-white py-2 rounded-lg disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Address"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Saved Addresses</h2>
          <button
            onClick={fetchAddresses}
            className="text-sm text-pink-600 hover:underline"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading addresses...</p>
        ) : addresses.length === 0 ? (
        <p>No saved addresses.</p>
      ) : (
        <ul className="space-y-4">
          {addresses.map((addr) => (
              <li
                key={addr.id}
                className={`border p-4 rounded relative ${
                  addr.is_default ? "border-pink-500" : ""
                }`}
              >
                {addr.is_default && (
                  <span className="absolute top-2 right-2 text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                    Default
                  </span>
                )}
                <p className="font-semibold">{addr.full_name}</p>
                <p className="text-sm text-gray-600">{addr.phone}</p>
                <p className="mt-2">
                  {addr.address_line1}
                  {addr.address_line2 && `, ${addr.address_line2}`}
                </p>
                <p>
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                {addr.landmark && (
                  <p className="text-sm text-gray-600">
                    Landmark: {addr.landmark}
                  </p>
                )}
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-sm text-blue-600 hover:underline"
                    disabled={addr.is_default}
                  >
                    Set Default
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}

