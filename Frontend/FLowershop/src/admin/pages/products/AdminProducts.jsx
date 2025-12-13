// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../../Api/axiosInstance";

// import AddProductModal from "./AddProductModal";
// import EditProductModal from "./EditProductModal";

// export default function AdminProducts() {
//   const [products, setProducts] = useState([]);
//   const [addModal, setAddModal] = useState(false);
//   const [editModal, setEditModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // Fetch Products
//   const loadProducts = () => {
//     axiosInstance.get("products/")
//       .then((res) => setProducts(res.data))
//       .catch((err) => console.error(err));
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const deleteProduct = (id) => {
//     if (!window.confirm("Are you sure you want to delete?")) return;

//     axiosInstance
//       .delete(`products/${id}/`)
//       .then(() => loadProducts())
//       .catch((err) => console.error(err));
//   };

//   return (
//     <div className="p-5">
//       <div className="flex justify-between mb-4">
//         <h2 className="text-2xl font-bold">Products</h2>
//         <button
//           onClick={() => setAddModal(true)}
//           className="bg-green-600 text-white px-4 py-2 rounded-md"
//         >
//           + Add Product
//         </button>
//       </div>

//       {/* Product Table */}
//       <div className="overflow-x-auto bg-white rounded-md shadow">
//         <table className="w-full text-left">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-3">Image</th>
//               <th className="p-3">Name</th>
//               <th className="p-3">Price</th>
//               <th className="p-3">Stock</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((item) => (
//               <tr key={item.id} className="border-b">
//                 <td className="p-3">
//                   <img
//                     src={item.image}
//                     className="w-16 h-16 object-cover rounded"
//                     alt=""
//                   />
//                 </td>
//                 <td className="p-3">{item.name}</td>
//                 <td className="p-3">₹{item.price}</td>
//                 <td className="p-3">{item.stock}</td>
//                 <td className="p-3">
//                   <button
//                     onClick={() => {
//                       setSelectedProduct(item);
//                       setEditModal(true);
//                     }}
//                     className="bg-blue-600 text-white px-3 py-1 rounded-md mr-2"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => deleteProduct(item.id)}
//                     className="bg-red-600 text-white px-3 py-1 rounded-md"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Product Modal */}
//       {addModal && <AddProductModal close={() => setAddModal(false)} reload={loadProducts} />}

//       {/* Edit Product Modal */}
//       {editModal && (
//         <EditProductModal
//           close={() => setEditModal(false)}
//           product={selectedProduct}
//           reload={loadProducts}
//         />
//       )}
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Api/axiosInstance";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch Products
  const loadProducts = () => {
    axiosInstance
      .get("products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    axiosInstance
      .delete(`products/${id}/`)
      .then(() => loadProducts())
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Products</h2>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          <FiPlus />
          Add Product
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="p-4">
                  <img
                    src={item.image || "/placeholder.png"}
                    className="w-16 h-16 object-cover rounded-lg"
                    alt={item.name}
                  />
                </td>
                <td className="p-4 font-medium text-gray-700">{item.name}</td>
                <td className="p-4 text-gray-600">₹{item.price}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(item);
                      setEditModal(true);
                    }}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition"
                  >
                    <FiEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(item.id)}
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid gap-4">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="flex items-center gap-4 mb-3">
              <img
                src={item.image || "/placeholder.png"}
                className="w-16 h-16 object-cover rounded-lg"
                alt={item.name}
              />
              <div>
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedProduct(item);
                  setEditModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition"
              >
                <FiEdit />
                Edit
              </button>
              <button
                onClick={() => deleteProduct(item.id)}
                className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition"
              >
                <FiTrash2 />
                Delete
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No products found.</p>
        )}
      </div>

      {/* Add Product Modal */}
      {addModal && <AddProductModal close={() => setAddModal(false)} reload={loadProducts} />}

      {/* Edit Product Modal */}
      {editModal && (
        <EditProductModal
          close={() => setEditModal(false)}
          product={selectedProduct}
          reload={loadProducts}
        />
      )}
    </div>
  );
}
