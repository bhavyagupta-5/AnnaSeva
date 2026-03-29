import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, ArrowRight } from "lucide-react";

function Register() {
  const [form, setForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post("/users/register", form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      navigate("/"); // same as your logic
    } catch (err) {
      console.log(err);
      alert("Error registering");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex-1 flex bg-white min-h-[calc(100vh-4rem)]">
      <div className="w-full flex items-center justify-center p-4 sm:p-8 bg-stone-50 relative overflow-hidden">
        
        {/* Background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-50"></div>

        <div className="w-full max-w-4xl glass p-8 sm:p-12 rounded-3xl relative z-10 my-8">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Join AnnaSeva</h1>
            <p className="mt-2 text-gray-600">
              Create an account to start sharing or volunteering
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LEFT */}
              <div className="space-y-4">
                <h3 className="font-semibold text-primary-700">Account Details</h3>

                <input
                  placeholder="Name"
                  className="input"
                  onChange={(e) => handleChange("name", e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="input"
                  onChange={(e) => handleChange("email", e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="input"
                  onChange={(e) => handleChange("password", e.target.value)}
                />

                <input
                  placeholder="Phone"
                  className="input"
                  onChange={(e) => handleChange("phoneNo", e.target.value)}
                />

                <select
                  className="input"
                  onChange={(e) => handleChange("role", e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="provider">Provider</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="ngo">NGO</option>
                </select>
              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                <h3 className="font-semibold text-primary-700">Location</h3>

                <input
                  placeholder="Street Address"
                  className="input"
                  onChange={(e) =>
                    handleChange("Street1_Address", e.target.value)
                  }
                />

                <input
                  placeholder="City"
                  className="input"
                  onChange={(e) => handleChange("City", e.target.value)}
                />

                <input
                  placeholder="State"
                  className="input"
                  onChange={(e) => handleChange("State", e.target.value)}
                />

                <input
                  placeholder="Country"
                  className="input"
                  onChange={(e) => handleChange("Country", e.target.value)}
                />

                <input
                  placeholder="Pincode"
                  className="input"
                  onChange={(e) => handleChange("Pincode", e.target.value)}
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition"
            >
              {isLoading ? "Creating..." : (
                <>
                  <UserPlus size={18} />
                  Register
                </>
              )}
            </button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 font-medium">
                Login <ArrowRight size={14} />
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;