import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    await axios.post("/users/register", form,{
      headers: {
        "Content-Type": "application/json",
      },
    });
    navigate("/");
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input placeholder="Name" onChange={(e) => setForm({...form, name: e.target.value})} />
      <input placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} />
      <input placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} />
       <input placeholder="Phone" onChange={(e) => setForm({...form, phoneNo: e.target.value})} />
      <select onChange={(e) => setForm({...form, role: e.target.value})}>
        <option value="">Select Role</option>
        <option value="provider">Provider</option>
        <option value="volunteer">Volunteer</option>
        <option value="ngo">NGO</option>
      </select>
            <input placeholder="Street Adress" onChange={(e) => setForm({...form, Street1_Address: e.target.value})} />

          <input placeholder="City" onChange={(e) => setForm({...form, City: e.target.value})} />
             <input placeholder="State" onChange={(e) => setForm({...form, State: e.target.value})} />
             <input placeholder="Country" onChange={(e) => setForm({...form, Country: e.target.value})} />
             <input placeholder="Pincode" onChange={(e) => setForm({...form, Pincode: e.target.value})} />
      <button>Register</button>
    </form>
  );
}

export default Register;
