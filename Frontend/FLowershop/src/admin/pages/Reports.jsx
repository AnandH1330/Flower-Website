
import React, { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Report() {
  const [data, setData] = useState({
    users: [],
    products: [],
    messages: [],
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes, messagesRes] = await Promise.all([
          axiosInstance.get("getdata/"),
          axiosInstance.get("products/"),
          axiosInstance.get("contact/all/"),
        ]);

        setData({
          users: usersRes.data,
          products: productsRes.data,
          messages: messagesRes.data,
        });
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ CSV/Excel Export
  const exportToExcel = (rows, filename) => {
    if (!rows || rows.length === 0) {
      alert("No data available to export.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${filename}.xlsx`);
  };

  // ✅ PDF Export
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Admin Report", 14, 15);
    doc.autoTable({
      startY: 25,
      head: [["Username", "Email", "Joined"]],
      body: data.users.map((u) => [
        u.username,
        u.email,
        new Date(u.date_joined).toLocaleDateString(),
      ]),
    });
    doc.save("users_report.pdf");
  };

  // ✅ Date Filter (by month/year)
  const filterByDate = (items, dateField = "date_joined") => {
    return items.filter((item) => {
      const date = new Date(item[dateField]);
      const monthMatch = filterMonth
        ? date.getMonth() + 1 === parseInt(filterMonth)
        : true;
      const yearMatch = filterYear
        ? date.getFullYear() === parseInt(filterYear)
        : true;
      return monthMatch && yearMatch;
    });
  };

  // ✅ Search Filter
  const filteredUsers = filterByDate(
    data.users.filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ✅ Example chart data (products by category)
  const categoryCounts = data.products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(categoryCounts).map((category) => ({
    name: category,
    count: categoryCounts[category],
  }));

  if (loading) return <p className="text-center mt-10">Loading reports...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        📊 Admin Reports Dashboard
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Years</option>
          {[2023, 2024, 2025].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h2 className="text-gray-500">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{data.users.length}</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h2 className="text-gray-500">Total Products</h2>
          <p className="text-3xl font-bold text-green-600">
            {data.products.length}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h2 className="text-gray-500">Total Messages</h2>
          <p className="text-3xl font-bold text-red-600">
            {data.messages.length}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
        <h2 className="text-lg font-semibold mb-3">Products by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filtered Users</h2>
          <div className="space-x-2">
            <button
              onClick={() => exportToExcel(filteredUsers, "users_report")}
              className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
            >
              Export Excel
            </button>
            <button
              onClick={exportToPDF}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            >
              Export PDF
            </button>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <p className="text-gray-500">No matching users found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Username</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.slice(0, 10).map((u) => (
                <tr key={u.id}>
                  <td className="border p-2">{u.username}</td>
                  <td className="border p-2">{u.email}</td>
                  <td className="border p-2 text-sm text-gray-500">
                    {new Date(u.date_joined).toLocaleDateString()}
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
