import { useState } from "react";
import axios from "../api/axios";

function ProviderDashboard() {
  const [food, setFood] = useState({});

  const postFood = async () => {
    await axios.post("/food/create", food);
    alert("Food Posted!");
  };

  return (
    <div>
      <h2>Post Surplus Food</h2>
      <input placeholder="Description"
        onChange={(e)=>setFood({...food, description:e.target.value})}/>
      <input placeholder="Quantity"
        onChange={(e)=>setFood({...food, quantity:e.target.value})}/>
      <button onClick={postFood}>Post Food</button>
    </div>
  );
}

export default ProviderDashboard;
