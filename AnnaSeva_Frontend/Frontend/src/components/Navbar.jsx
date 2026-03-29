import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Leaf, LogOut, Award } from "lucide-react";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="bg-primary-500 p-2 rounded-xl text-white group-hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30">
              <Leaf size={24} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-500">
              AnnaSeva
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-4">
                  <span className="text-sm border border-primary-200 bg-primary-50 px-3 py-1 rounded-full text-primary-700 font-medium capitalize">
                    {user.role}
                  </span>
                  {user.role === "volunteer" && (
                    <div className="flex items-center gap-1 text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-200 text-sm font-semibold">
                      <Award size={16} />
                      {user.rewardPoints || 0} pts
                    </div>
                  )}
                </div>
                
                <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-medium p-2 rounded-lg hover:bg-red-50"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
