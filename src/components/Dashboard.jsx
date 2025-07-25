import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// ✅ Correct path to fetchAllUrls from urlSlice
import { fetchAllUrls } from "../Utils/Redux/urlSlice";

// ✅ Correct path to setLoader from loadingSlice
import { setLoader } from "../Utils/Redux/loadingSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isLoading, urls: allUrls, isError } = useSelector((state) => state.urls);
  const [originalUrl, setOriginalUrl] = useState("");

  useEffect(() => {
    dispatch(fetchAllUrls());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setLoader(1));
    const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/url/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        originalUrl,
        userId: localStorage.getItem("userId"),
      }),
    });

    const data = await res.json();
    dispatch(setLoader(0));

    if (res.ok) {
      dispatch(fetchAllUrls()); // Refresh list after adding
      setOriginalUrl(""); // Clear input
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📌 Your Dashboard</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="url"
          required
          placeholder="Enter original URL..."
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="border px-4 py-2 w-full mb-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Shorten URL
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">🔗 Your Shortened URLs</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to fetch URLs.</p>
      ) : allUrls?.length > 0 ? (
        <ul className="space-y-4">
          {allUrls.map((url, index) => (
            <li key={url._id || index} className="bg-gray-100 p-4 rounded">
              <p>🌍 Original: {url.originalUrl}</p>
              <p>
                🔗 Short:{" "}
                <a
                  href={url.shortUrl}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.shortUrl}
                </a>
              </p>
              <p>📊 Clicks: {url.clickCount}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No URLs yet.</p>
      )}
    </div>
  );
};

export default Dashboard;
