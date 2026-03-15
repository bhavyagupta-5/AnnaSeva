import { useState, useEffect } from "react";
import axios from "../api/axios";

function ProviderDashboard() {
  const [food, setFood] = useState({});
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [myFood, setMyFood] = useState([]);

  // GET LOCATION WITH RETRY
  const getCurrentLocation = (retry = 0) => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setFood({
          ...food,
          location: {
            type: "Point",
            coordinates: [lng, lat],
          },
        });

        setLoadingLocation(false);
      },
      (error) => {
        console.log("Location error:", error);

        if (retry < 2) {
          setTimeout(() => getCurrentLocation(retry + 1), 2000);
        } else {
          alert("Unable to fetch location");
          setLoadingLocation(false);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // POST FOOD
  const postFood = async () => {
    try {
      await axios.post("/food/create", food);
      alert("Food Posted!");

      setFood({});
      getMyPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // GET MY POSTS
  const getMyPosts = async () => {
    try {
      const res = await axios.get("/food/my-posts");
      setMyFood(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMyPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-10">
        Provider Dashboard
      </h1>

      {/* POST FOOD CARD */}
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md mb-10">

        <h2 className="text-xl font-semibold mb-4">
          Post Surplus Food
        </h2>

        <input
          className="border w-full p-2 rounded mb-3"
          placeholder="Food Description"
          value={food.description || ""}
          onChange={(e) =>
            setFood({ ...food, description: e.target.value })
          }
        />

        <input
          className="border w-full p-2 rounded mb-3"
          placeholder="Quantity"
          value={food.quantity || ""}
          onChange={(e) =>
            setFood({ ...food, quantity: e.target.value })
          }
        />

        {/* LOCATION DISPLAY */}
        <input
          className="border w-full p-2 rounded mb-3 bg-gray-100"
          placeholder="Location"
          value={
            food.location
              ? `${food.location.coordinates[1]}, ${food.location.coordinates[0]}`
              : ""
          }
          readOnly
        />

        <button
          onClick={() => getCurrentLocation()}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mb-3"
        >
          {loadingLocation ? "Getting Location..." : "Use Current Location"}
        </button>

        <button
          onClick={postFood}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Post Food
        </button>

      </div>

      {/* MY POSTS */}
      <h2 className="text-2xl font-semibold text-center mb-6">
        My Food Posts
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {myFood.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            No food posts yet
          </p>
        )}

        {myFood.map((food) => (
          <div
            key={food._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >

            <h3 className="text-lg font-semibold mb-2">
              {food.description}
            </h3>

            <p className="text-gray-600">
              <span className="font-semibold">Quantity:</span> {food.quantity}
            </p>

            <p className="text-gray-600">
              <span className="font-semibold">Location:</span>{" "}
              {food.location?.coordinates?.[1]},
              {food.location?.coordinates?.[0]}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Status: {food.status}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}

export default ProviderDashboard;