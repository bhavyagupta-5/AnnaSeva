import { useEffect, useState } from "react";
import axios from "../api/axios";

function VolunteerDashboard() {
  const [foodList, setFoodList] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const res = await axios.get(
        `/volunteer/nearby?lng=${longitude}&lat=${latitude}`
      );

      setFoodList(res.data);
    });
  }, []);

  const accept = async (id) => {
    await axios.post(`/volunteer/accept/${id}`);
    alert("Accepted!");
  };

  return (
    <div>
      <h2>Nearby Food</h2>
      {foodList.map((food) => (
        <div key={food._id}>
          <p>{food.description}</p>
          <button onClick={() => accept(food._id)}>Accept</button>
        </div>
      ))}
    </div>
  );
}

export default VolunteerDashboard;
