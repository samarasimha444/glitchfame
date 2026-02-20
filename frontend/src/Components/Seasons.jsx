

const Seasons = ({ seasons }) => {

  if (!seasons.length) {
    return <p>No seasons available.</p>;
  }

  return (
    <div>
      {seasons.map((season) => (
        <div
          key={season.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px"
          }}
        >
          <h3>{season.name}</h3>

          <p><strong>Prize:</strong> ₹{season.prizeMoney}</p>

          <p>
            <strong>Registration:</strong><br />
            {season.registrationStartDate} → {season.registrationEndDate}
          </p>

          <p>
            <strong>Voting:</strong><br />
            {season.votingStartDate} → {season.votingEndDate}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Seasons;