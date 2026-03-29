import { useState, useEffect } from "react";

import axios from "../api/axios";
import { MapPin, Plus, Package, Clock, CheckCircle } from "lucide-react";

function ProviderDashboard() {
  const [food, setFood] = useState({ description: "", quantity: "" });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [myFood, setMyFood] = useState([]);

  // GET LOCATION WITH RETRY
  const getCurrentLocation = (retry = 0) => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
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
          alert("Unable to fetch location. Please ensure location services are enabled.");
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
    if (!food.description || !food.quantity || !food.location) {
      alert("Please fill all fields and get your location.");
      return;
    }
    
    setIsPosting(true);
    try {
      await axios.post("/food/create", food);
      setFood({ description: "", quantity: "" });
      getMyPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to post food.");
    } finally {
      setIsPosting(false);
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
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 pb-12">
      {/* Hero Banner */}
      <div className="bg-primary-700 w-full pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1593113565694-c700e5f14060?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">Provider Dashboard</h1>
            <p className="text-primary-100 text-lg md:text-xl max-w-2xl">Thank you for your generosity. Share your surplus food and help nourish the community.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30 flex items-center gap-4">
            <div className="bg-white text-primary-600 p-3 rounded-xl shadow-lg">
              <Package size={28} />
            </div>
            <div>
              <p className="text-primary-100 font-medium text-sm">Total Contributions</p>
              <p className="text-3xl font-bold text-white">{myFood.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* POST FOOD CARD (Left Col) */}
          <div className="lg:col-span-1">
            <div className="glass p-8 rounded-3xl sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-accent-100 p-2 rounded-lg text-accent-600">
                  <Plus size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Post Surplus Food</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What's available?</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/60 transition-colors"
                    placeholder="e.g. 50 boxes of vegetable biryani"
                    value={food.description || ""}
                    onChange={(e) => setFood({ ...food, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Details</label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/60 transition-colors"
                    placeholder="e.g. Feeds 50 people"
                    value={food.quantity || ""}
                    onChange={(e) => setFood({ ...food, quantity: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                      placeholder="Coordinates will appear here"
                      value={food.location ? `${food.location.coordinates[1].toFixed(4)}, ${food.location.coordinates[0].toFixed(4)}` : ""}
                      readOnly
                    />
                    <button
                      onClick={() => getCurrentLocation()}
                      disabled={loadingLocation}
                      className="bg-primary-100 text-primary-700 p-3 rounded-xl hover:bg-primary-200 transition-colors disabled:opacity-50"
                      title="Get Current Location"
                    >
                      <MapPin size={24} className={loadingLocation ? "animate-pulse" : ""} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={postFood}
                  disabled={isPosting || loadingLocation}
                  className="w-full mt-4 flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-500/30 text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium transition-all disabled:opacity-70 text-lg"
                >
                  {isPosting ? "Posting..." : "Share Food"}
                </button>
              </div>
            </div>
          </div>

          {/* MY POSTS (Right Col) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mt-2 lg:mt-0">
              <Clock className="text-primary-500" /> Recent Contributions
            </h2>

            {myFood.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                <div className="bg-primary-50 text-primary-300 p-6 rounded-full mb-4">
                  <Package size={48} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No food posted yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">When you share surplus food, it will appear here so you can track its status.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {myFood.map((item) => (
                  <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                          {item.description}
                        </h3>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          item.status === 'Available' ? 'bg-green-50 text-green-700 border-green-200' : 
                          item.status === 'Accepted' ? 'bg-accent-50 text-accent-700 border-accent-200' : 
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {item.status || "Available"}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-6">
                        <div className="flex items-start gap-2">
                          <Package size={16} className="text-gray-400 mt-0.5 shrink-0" />
                          <span>{item.quantity}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">
                            {item.location?.coordinates?.[1].toFixed(4)}, {item.location?.coordinates?.[0].toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {item.status === 'Completed' ? (
                      <div className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50/50 p-2 rounded-lg justify-center border border-green-100">
                        <CheckCircle size={16} /> Collected Successfully
                      </div>
                    ) : (
                      <div className="w-full bg-gray-50 h-1 rounded-full overflow-hidden">
                        <div className={`h-full ${item.status === 'Accepted' ? 'w-1/2 bg-accent-500' : 'w-1/4 bg-primary-400 animate-pulse'}`}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;
