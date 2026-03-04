import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProviderDashboard from "./ProviderDashboard";
import VolunteerDashboard from "./VolunteerDashboard";

function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) return <div>Please login</div>;

  if (user.role === "provider") return <ProviderDashboard />;
  if (user.role === "volunteer") return <VolunteerDashboard />;

  return <div>NGO Dashboard Coming Soon</div>;
}

export default Dashboard;
