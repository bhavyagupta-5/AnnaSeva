import { useEffect, useState } from "react";
import axios from "../api/axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Map, MapPin, Package, Check, Navigation, AlertCircle } from "lucide-react";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function VolunteerDashboard() {
  const [foodList, setFoodList] = useState([]);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFood, setActiveFood] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);

  // fetch food
  const fetchNearbyFood = async (lat, lng) => {
    try {
      const res = await axios.get(
        `/volunteer/nearby?lng=${lng}&lat=${lat}`
        `/volunteer/nearby?lng=${lng}&lat=${lat}`
      );
      setFoodList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // get location with retry
  const getLocation = (retry = 0) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        fetchNearbyFood(lat, lng);
      },
      (error) => {
        console.log("Location error:", error);
        if (retry < 2) {
          setTimeout(() => getLocation(retry + 1), 2000);
        } else {
          alert("Unable to detect location. Please check permissions.");
          setLoading(false);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const accept = async (id) => {
    setIsAccepting(true);
    try {
      await axios.post(`/volunteer/accept/${id}`);
      setFoodList((prev) => prev.filter((food) => food._id !== id));
      setActiveFood(null);
    } catch (err) {
      console.error(err);
      alert("Failed to accept pickup.");
    } finally {
      setIsAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Detecting your location...</p>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-stone-50 p-6">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Required</h2>
        <p className="text-gray-600 text-center max-w-md">We need your location to show nearby food available for pickup. Please enable location services and refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between z-10 relative">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Navigation className="text-primary-600" /> Active Volunteer Area
          </h1>
          <p className="text-sm text-gray-500 mt-1">Showing available food donations near your current location.</p>
        </div>
        <div className="bg-primary-50 text-primary-700 font-semibold px-4 py-2 rounded-xl border border-primary-100 hidden sm:block">
          {foodList.length} Pickups Available
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Sidebar: Food List */}
        <div className="w-full lg:w-[450px] bg-stone-50 border-r border-gray-200 flex flex-col h-[400px] lg:h-auto lg:absolute lg:inset-y-0 lg:left-0 z-10 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-gray-200 bg-white sticky top-0 z-20">
            <h2 className="text-lg font-bold text-gray-900">Nearby Donations</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {foodList.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MapPin size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No available food posts nearby right now.</p>
                <p className="text-sm text-gray-400 mt-1">Check back soon for new donation requests.</p>
              </div>
            ) : (
              foodList.map((food) => (
                <div
                  key={food._id}
                  onClick={() => setActiveFood(food._id)}
                  className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer ${
                    activeFood === food._id 
                      ? 'border-primary-500 shadow-md ring-1 ring-primary-500/50 scale-[1.02]' 
                      : 'border-gray-200 shadow-sm hover:border-primary-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900 line-clamp-2 pr-2">{food.description}</h3>
                    <div className="bg-orange-50 text-orange-600 p-1.5 rounded-lg shrink-0">
                      <Package size={18} />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-xs uppercase tracking-wider">Qty</span>
                      {food.quantity}
                    </p>
                    <p className="text-xs text-gray-500 flex items-start gap-1.5">
                      <MapPin size={14} className="mt-0.5" shrink-0 />
                      {food.location.coordinates[1].toFixed(4)}, {food.location.coordinates[0].toFixed(4)}
                    </p>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      accept(food._id);
                    }}
                    disabled={isAccepting}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    <Check size={16} /> Accept Pickup
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative h-[500px] lg:h-auto lg:ml-[450px] z-0">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className="z-0 relative"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {/* volunteer marker */}
            <Marker position={position} icon={icon}>
              <Popup>
                <div className="font-semibold text-center py-1">You are here</div>
              </Popup>
            </Marker>

            {/* food markers */}
            {foodList.map((food) => (
              <Marker
                key={food._id}
                position={[
                  food.location.coordinates[1],
                  food.location.coordinates[0],
                ]}
                icon={icon}
                eventHandlers={{
                  click: () => setActiveFood(food._id),
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-gray-900 mb-1">{food.description}</h3>
                    <p className="text-sm text-gray-600 mb-3">Qty: {food.quantity}</p>
                    <button
                      onClick={() => accept(food._id)}
                      disabled={isAccepting}
                      className="w-full bg-primary-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-primary-700"
                    >
                      Accept
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Map Overlay Gradient */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-stone-50/50 to-transparent pointer-events-none hidden lg:block z-[400]"></div>
        </div>
      </div>
    </div>
  );
}

export default VolunteerDashboard;