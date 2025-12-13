import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";

const defaultForm = {
  id: null,
  code: "",
  description: "",
  discount_type: "percent",
  discount_value: 10,
  min_order_value: 0,
  max_discount_value: "",
  usage_limit: "",
  start_date: "",
  end_date: "",
  is_active: true,
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCoupons = () => {
    axiosInstance
      .get("coupons/")
      .then((res) => setCoupons(res.data))
      .catch(() => setError("Failed to load coupons"));
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const setField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => setForm(defaultForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      code: form.code.trim().toUpperCase(),
      description: form.description,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_order_value: Number(form.min_order_value || 0),
      max_discount_value: form.max_discount_value
        ? Number(form.max_discount_value)
        : null,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      is_active: form.is_active,
    };

    try {
      if (form.id) {
        await axiosInstance.put(`coupons/${form.id}/`, payload);
      } else {
        await axiosInstance.post("coupons/", payload);
      }
      resetForm();
      loadCoupons();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coupon) => {
    setForm({
      id: coupon.id,
      code: coupon.code,
      description: coupon.description || "",
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_value: coupon.min_order_value,
      max_discount_value: coupon.max_discount_value || "",
      usage_limit: coupon.usage_limit || "",
      start_date: coupon.start_date || "",
      end_date: coupon.end_date || "",
      is_active: coupon.is_active,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await axiosInstance.delete(`coupons/${id}/`);
      loadCoupons();
    } catch {
      setError("Unable to delete coupon");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-pink-600">Coupons</h2>
        <button
          onClick={resetForm}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
        >
          New Coupon
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-4 grid gap-4 md:grid-cols-2"
      >
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Code
          </label>
          <input
            value={form.code}
            onChange={(e) => setField("code", e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 uppercase"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Discount Type
          </label>
          <select
            value={form.discount_type}
            onChange={(e) => setField("discount_type", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="percent">Percentage</option>
            <option value="amount">Flat Amount</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Discount Value
          </label>
          <input
            type="number"
            step="0.01"
            value={form.discount_value}
            onChange={(e) => setField("discount_value", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Minimum Order Value
          </label>
          <input
            type="number"
            step="0.01"
            value={form.min_order_value}
            onChange={(e) => setField("min_order_value", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Max Discount Value
          </label>
          <input
            type="number"
            step="0.01"
            value={form.max_discount_value}
            onChange={(e) => setField("max_discount_value", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Usage Limit
          </label>
          <input
            type="number"
            value={form.usage_limit}
            onChange={(e) => setField("usage_limit", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Start Date
          </label>
          <input
            type="date"
            value={form.start_date}
            onChange={(e) => setField("start_date", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            End Date
          </label>
          <input
            type="date"
            value={form.end_date}
            onChange={(e) => setField("end_date", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setField("is_active", e.target.checked)}
          />
          <span>Active</span>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={2}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        {error && <p className="text-red-500 text-sm md:col-span-2">{error}</p>}
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
          >
            {form.id ? "Update Coupon" : "Create Coupon"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {coupons.length === 0 ? (
          <p className="p-4 text-gray-500">No coupons created yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Type</th>
                <th className="p-3">Value</th>
                <th className="p-3">Min Order</th>
                <th className="p-3">Usage</th>
                <th className="p-3">Validity</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-t">
                  <td className="p-3 font-semibold">{coupon.code}</td>
                  <td className="p-3 capitalize">{coupon.discount_type}</td>
                  <td className="p-3">
                    {coupon.discount_type === "percent"
                      ? `${coupon.discount_value}%`
                      : `₹${coupon.discount_value}`}
                  </td>
                  <td className="p-3">₹{coupon.min_order_value}</td>
                  <td className="p-3">
                    {coupon.used_count}/{coupon.usage_limit || "∞"}
                  </td>
                  <td className="p-3">
                    {coupon.start_date || "—"} → {coupon.end_date || "—"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        coupon.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {coupon.is_active ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="px-3 py-1 text-xs rounded bg-red-100 text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

