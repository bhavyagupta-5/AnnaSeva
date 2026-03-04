import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    await axios.post("/users/register", form);
    navigate("/");
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input placeholder="Name" onChange={(e) => setForm({...form, name: e.target.value})} />
      <input placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} />
      <input placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} />
      <select onChange={(e) => setForm({...form, role: e.target.value})}>
        <option value="">Select Role</option>
        <option value="provider">Provider</option>
        <option value="volunteer">Volunteer</option>
        <option value="ngo">NGO</option>
      </select>
      <button>Register</button>
    </form>
  );
}

export default Register;
