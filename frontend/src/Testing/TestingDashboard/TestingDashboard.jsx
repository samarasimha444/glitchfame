import { useEffect, useState } from "react";
import TestingSeasons from "./TestingSeasons";
import TestingSeasonContestants from "../TestingSeasonContestants";

export default function TestingDashboard() {

  const [profile, setProfile] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);

  useEffect(() => {

    const fetchProfile = async () => {

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/profile/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setProfile(data);
    };

    fetchProfile();

  }, []);

  if (!profile) return <div>Loading profile...</div>;

  return (

    <div>

      <h2>User Dashboard</h2>

      <p><b>Username:</b> {profile.username}</p>
      <p><b>Email:</b> {profile.email}</p>

      <TestingSeasons onSeasonSelect={setSelectedSeason} />

      {selectedSeason && (
        <TestingSeasonContestants seasonId={selectedSeason} />
      )}

    </div>

  );

}