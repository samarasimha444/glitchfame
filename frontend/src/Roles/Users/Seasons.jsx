import { useNavigate } from "react-router-dom";

const Seasons = ({ seasons }) => {

  const navigate = useNavigate();

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
      {seasons.map((season) => (
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
            <strong>Registration:</strong><br />
            {new Date(season.registrationStartDate).toLocaleString()} →{" "}
            {new Date(season.registrationEndDate).toLocaleString()}
          </p>

          <p>
            <strong>Voting:</strong><br />
            {new Date(season.votingStartDate).toLocaleString()} →{" "}
            {new Date(season.votingEndDate).toLocaleString()}
          </p>

          <button
            onClick={() =>
              navigate(`/dashboard/${season.id}/participate`)
            }
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              cursor: "pointer"
            }}
          >
            Participate
          </button>
        </div>
      ))}
    </div>
  );
};

export default Seasons;