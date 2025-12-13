// import React, { useState } from "react";
// import axiosInstance from "../../../Api/axiosInstance";

// export default function EditProductModal({ close, reload, product }) {
//   const [formData, setFormData] = useState({
//     name: product.name,
//     price: product.price,
//     stock: product.stock,
//     description: product.description,
//     image: null,
//   });

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
//       if (formData[key] !== null) data.append(key, formData[key]);
//     });

//     axiosInstance.put(`products/${product.id}/`, data, {
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

//         <h2 className="text-xl font-bold mb-4">Edit Product</h2>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="name"
//             defaultValue={product.name}
//             className="w-full p-2 border mb-3"
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="number"
//             name="price"
//             defaultValue={product.price}
//             className="w-full p-2 border mb-3"
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="number"
//             name="stock"
//             defaultValue={product.stock}
//             className="w-full p-2 border mb-3"
//             onChange={handleChange}
//             required
//           />

//           <textarea
//             name="description"
//             defaultValue={product.description}
//             className="w-full p-2 border mb-3"
//             onChange={handleChange}
//           ></textarea>

//           <label className="text-sm text-gray-600 mb-2 block">Change Image (optional):</label>
//           <input type="file" name="image" onChange={handleChange} className="mb-3" />

//           <div className="flex justify-end gap-3">
//             <button type="button" onClick={close} className="px-4 py-2 bg-gray-400 text-white rounded">
//               Cancel
//             </button>
//             <button className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Api/axiosInstance";

export default function EditProductModal({ close, reload, product }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category?.id || "",
    discount_percent: product.discount_percent || 0,
    is_active: product.is_active,
    is_featured: product.is_featured,
    image: null,
  });

  useEffect(() => {
    axiosInstance
      .get("categories/")
      .then((res) => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "file"
          ? files[0]
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value);
      }
    });

    axiosInstance
      .put(`products/${product.id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        reload();
        close();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-md w-96">

        <h2 className="text-xl font-bold mb-4">Edit Product</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border mb-3"
            required
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border mb-3"
            required
          />

          <input
            type="number"
            name="discount_percent"
            value={formData.discount_percent}
            onChange={handleChange}
            className="w-full p-2 border mb-3"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border mb-3"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border mb-3"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex gap-4 mb-3 text-sm">
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <span className="ml-1">Active</span>
            </label>

            <label>
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
              />
              <span className="ml-1">Featured</span>
            </label>
          </div>

          {product.image && (
            <img
              src={product.image}
              alt="Product"
              className="w-20 h-20 object-cover mb-3 rounded"
            />
          )}

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="mb-4"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Update
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}


