import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Seasons = ({ seasons }) => {

  const navigate = useNavigate();
  const [now, setNow] = useState(Date.now());

  // Update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getCountdown = (endDate) => {
    const diff = new Date(endDate).getTime() - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  if (!seasons || seasons.length === 0) {
    return <p>No seasons available.</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        gap: "20px",
        padding: "20px 0"
      }}
    >
      {seasons.map((season) => {

        const registrationCountdown = getCountdown(season.registrationEndDate);
        const votingCountdown = getCountdown(season.votingEndDate);

        const registrationEnded = registrationCountdown === "Ended";

        return (
          <div
            key={season.id}
            style={{
              minWidth: "300px",
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
              flexShrink: 0
            }}
          >
            <h3>{season.name}</h3>

            <p><strong>Prize:</strong> ₹{season.prizeMoney}</p>

            <p>
              <strong>Registration Ends In:</strong><br />
              {registrationCountdown}
            </p>

            <p>
              <strong>Voting Ends In:</strong><br />
              {votingCountdown}
            </p>

            <button
              onClick={() =>
                navigate(`/dashboard/${season.id}/participate`)
              }
              disabled={registrationEnded}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                cursor: registrationEnded ? "not-allowed" : "pointer",
                backgroundColor: registrationEnded ? "#ccc" : "#007bff",
                color: "#fff",
                border: "none"
              }}
            >
              {registrationEnded ? "Registration Closed" : "Participate"}
            </button>

          </div>
        );
      })}
    </div>
  );
};

export default Seasons;