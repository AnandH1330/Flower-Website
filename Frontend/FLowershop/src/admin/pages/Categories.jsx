import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";

const initialForm = { id: null, name: "", description: "" };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = () => {
    setLoading(true);
    axiosInstance
      .get("categories/")
      .then((res) => setCategories(res.data))
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const setField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      description: form.description,
    };

    try {
      if (form.id) {
        await axiosInstance.put(`categories/${form.id}/`, payload);
      } else {
        await axiosInstance.post("categories/", payload);
      }
      resetForm();
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setForm({
      id: cat.id,
      name: cat.name,
      description: cat.description,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axiosInstance.delete(`categories/${id}/`);
      loadCategories();
    } catch {
      setError("Unable to delete category");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-pink-600">Categories</h2>
        <button
          onClick={() => resetForm()}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
        >
          Add New
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-4 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <input
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-300"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {form.id ? "Update Category" : "Create Category"}
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
        {loading ? (
          <p className="p-4">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="p-4 text-gray-500">No categories yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Products</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t text-sm">
                  <td className="p-3 font-medium">{cat.name}</td>
                  <td className="p-3 text-gray-600">
                    {cat.description || "—"}
                  </td>
                  <td className="p-3">{cat.product_count ?? 0}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="px-3 py-1 rounded bg-red-100 text-red-700 text-xs"
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

