import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TestingSeasons() {

  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // router navigation

  useEffect(() => {

    const fetchSeasons = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/seasons`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch seasons");

        const data = await res.json();

        setSeasons(data);

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false);

      }

    };

    fetchSeasons();

  }, []);

  if (loading) return <div>Loading seasons...</div>;
  if (error) return <div>Error: {error}</div>;

  return (

    <div>

      <h2>Seasons</h2>

      {seasons.map((season) => (

        <button
          key={season.seasonId}
          onClick={() => navigate(`/testing-season/${season.seasonId}`)}
          style={{
            display: "block",
            width: "100%",
            border:"1px solid #ccc",
            margin:"10px",
            padding:"10px",
            textAlign:"left",
            cursor:"pointer",
            background:"white"
          }}
        >

          <h3>{season.seasonName}</h3>

          <p>Season ID: {season.seasonId}</p>
          <p>Prize Money: {season.prizeMoney}</p>

          <p>Registration Start: {season.registrationStartDate}</p>
          <p>Registration End: {season.registrationEndDate}</p>

          <p>Voting Start: {season.votingStartDate}</p>
          <p>Voting End: {season.votingEndDate}</p>

          <p>Participation Status: {season.participationStatus}</p>

          <p>Vote Lock: {season.voteLock ? "Yes" : "No"}</p>
          <p>Participation Lock: {season.participationLock ? "Yes" : "No"}</p>
          <p>Season Lock: {season.seasonLock ? "Yes" : "No"}</p>

          {season.seasonPhotoUrl && (
            <img src={season.seasonPhotoUrl} alt="season" width="200"/>
          )}

        </button>

      ))}

    </div>

  );

}