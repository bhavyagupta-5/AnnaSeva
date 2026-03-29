import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProviderDashboard from "./ProviderDashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import { Link } from "react-router-dom";
import { Construction, Lock } from "lucide-react";

function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-stone-50 p-6 min-h-[calc(100vh-4rem)]">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center max-w-md">
        <div className="bg-red-50 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-8">Please log in to access your dashboard and manage your contributions.</p>
        <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors w-full inline-block shadow-lg shadow-primary-500/30">
          Go to Login
        </Link>
      </div>
    </div>
  );

  if (user.role === "provider") return <ProviderDashboard />;
  if (user.role === "volunteer") return <VolunteerDashboard />;

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-stone-50 p-6 min-h-[calc(100vh-4rem)]">
      <div className="glass p-12 rounded-3xltext-center max-w-lg border border-gray-200 border-dashed">
        <div className="bg-accent-50 text-accent-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">NGO Portal</h2>
        <p className="text-gray-600 text-lg">We're actively building the NGO dashboard. Check back soon for powerful organizational tools to manage distributions.</p>
      </div>
    </div>
  );
}

export default Dashboard;