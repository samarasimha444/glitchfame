import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import Seasons from "./Seasons";

const fetchSeasons = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/seasons`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch seasons");

  return response.json();
};

const Dashboard = () => {
  const { profile } = useOutletContext();

  const { data: seasons = [], isLoading } = useQuery({
    queryKey: ["seasons"],
    queryFn: fetchSeasons,
  });

  if (isLoading) return <h3>Loading seasons...</h3>;

  return (
    <div>
      <h2>Welcome {profile.username}</h2>
      <Seasons seasons={seasons} />
    </div>
  );
};

export default Dashboard;