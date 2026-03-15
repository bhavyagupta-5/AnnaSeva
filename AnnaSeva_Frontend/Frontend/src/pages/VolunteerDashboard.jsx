import { useEffect, useState } from "react";
import axios from "../api/axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
});

function VolunteerDashboard() {
  const [foodList, setFoodList] = useState([]);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch food
  const fetchNearbyFood = async (lat, lng) => {
    try {
      const res = await axios.get(
        `/volunteer/nearby?lng=${lng}&lat=${lat}`
      );

      console.log("Nearby food:", res.data);

      setFoodList(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // get location with retry
  const getLocation = (retry = 0) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        console.log("Volunteer location:", lat, lng);

        setPosition([lat, lng]);

        fetchNearbyFood(lat, lng);
      },
      (error) => {
        console.log("Location error:", error);

        if (retry < 2) {
          setTimeout(() => getLocation(retry + 1), 2000);
        } else {
          alert("Unable to detect location");
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
    try {
      await axios.post(`/volunteer/accept/${id}`);
      alert("Pickup Accepted!");

      setFoodList((prev) => prev.filter((food) => food._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Detecting location...</p>;
  if (!position) return <p>Location not available</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Volunteer Dashboard</h1>

      {/* MAP */}
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "500px", width: "100%", marginBottom: "30px" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* volunteer marker */}
        <Marker position={position} icon={icon}>
          <Popup>You are here</Popup>
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
          >
            <Popup>
              <h3>{food.description}</h3>
              <p>Quantity: {food.quantity}</p>

              <button
                onClick={() => accept(food._id)}
                style={{
                  padding: "6px 10px",
                  background: "green",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Accept Pickup
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* FOOD LIST */}
      <h2>Nearby Food</h2>

      {foodList.map((food) => (
        <div
          key={food._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>{food.description}</p>
          <p>Quantity: {food.quantity}</p>

          <button onClick={() => accept(food._id)}>Accept</button>
        </div>
      ))}
    </div>
  );
}

export default VolunteerDashboard;