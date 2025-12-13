import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/search/?q=${query}`)
      .then(res => res.json())
      .then(data => setResults(data));
  }, [query]);

  return (
    <div className="px-5 py-4">
      <h2 className="text-xl font-bold mb-4">
        Search results for: "{query}"
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map(product => (
          <div key={product.id} className="border rounded p-3">
            <img src={product.image} className="w-full h-32 object-cover" />
            <p className="font-semibold mt-2">{product.name}</p>
            <p className="text-pink-600">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
