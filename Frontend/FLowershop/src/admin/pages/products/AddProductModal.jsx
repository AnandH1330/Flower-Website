// import React, { useState, useEffect } from "react";
// import axiosInstance from "../../../Api/axiosInstance";

// export default function AddProductModal({ close, reload }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     stock: "",
//     description: "",
//     image: null,
//     category_id: "",
//   });
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axiosInstance
//       .get("categories/")
//       .then((res) => setCategories(res.data))
//       .catch(() => setError("Failed to load categories"))
//       .finally(() => setLoading(false));
//   }, []);

//   const handleChange = (e) => {
//     let value = e.target.value;
//     let name = e.target.name;

//     if (e.target.type === "file") value = e.target.files[0];

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     let data = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (formData[key] !== null && formData[key] !== "") {
//         data.append(key, formData[key]);
//       }
//     });

//     axiosInstance.post("products/", data, {
//       headers: { "Content-Type": "multipart/form-data" },
//     })
//       .then(() => {
//         reload();
//         close();
//       })
//       .catch((err) => console.error(err));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//       <div className="bg-white p-5 rounded-md w-96">

//         <h2 className="text-xl font-bold mb-4">Add New Product</h2>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="name"
//             placeholder="Product Name"
//             className="w-full p-2 border mb-3"
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="number"
//             name="price"
//             placeholder="Price"
//             className="w-full p-2 border mb-3"
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="number"
//             name="stock"
//             placeholder="Stock"
//             className="w-full p-2 border mb-3"
//             onChange={handleChange}
//             required
//           />

//           <textarea
//             name="description"
//             placeholder="Description"
//             className="w-full p-2 border mb-3"
//             onChange={handleChange}
//           ></textarea>

//           <select
//             name="category_id"
//             className="w-full p-2 border mb-3"
//             onChange={handleChange}
//             value={formData.category_id}
//             required
//             disabled={loading}
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>

//           <input
//             type="file"
//             name="image"
//             onChange={handleChange}
//             className="mb-3"
//             required
//           />

//           {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

//           <div className="flex justify-end gap-3">
//             <button type="button" onClick={close} className="px-4 py-2 bg-gray-400 text-white rounded">
//               Cancel
//             </button>
//             <button className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }








import React, { useState, useEffect } from "react";
import axiosInstance from "../../../Api/axiosInstance";

export default function AddProductModal({ close, reload }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    discount_percent: 0,
    is_active: true,
    is_featured: false,
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance.get("categories/")
      .then((res) => setCategories(res.data))
      .catch(() => setError("Failed to load categories"));
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "file"
          ? files[0]
          : type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") data.append(key, value);
    });

    axiosInstance
      .post("products/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        reload();
        close();
      })
      .catch(() => setError("Failed to add product"));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-md w-96">

        <h2 className="text-xl font-bold mb-4">Add Product</h2>

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Product Name"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="discount_percent"
            placeholder="Discount %"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
          />

          <select
            name="category"
            className="w-full p-2 border mb-3"
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <div className="flex gap-4 mb-3 text-sm">
            <label>
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
              <span className="ml-1">Active</span>
            </label>

            <label>
              <input type="checkbox" name="is_featured" onChange={handleChange} />
              <span className="ml-1">Featured</span>
            </label>
          </div>

          <input type="file" name="image" onChange={handleChange} required />

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={close} className="px-4 py-2 bg-gray-400 text-white rounded">
              Cancel
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded">
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

