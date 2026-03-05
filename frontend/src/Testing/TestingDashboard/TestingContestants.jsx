import { useEffect, useState } from "react";

export default function TestingContestants() {

  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");



  // ================= LOAD CONTESTANTS =================

  useEffect(() => {

    const fetchContestants = async () => {

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/contestants?page=0&size=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setContestants(data.content);

      setLoading(false);
    };

    fetchContestants();

  }, []);




  // ================= TOGGLE VOTE =================

const toggleVote = async (participationId) => {
  try {

    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/votes/toggle/${participationId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {

      const text = await res.text(); // read raw response

      try {
        const json = JSON.parse(text);
        throw new Error(json.message || json.error || text);
      } catch {
        throw new Error(text);
      }

    }

    const data = await res.json();

    setContestants(prev =>
      prev.map(c =>
        c.participationId === participationId
          ? {
              ...c,
              hasVoted: data.hasVoted ? 1 : 0,
              voteCount: data.voteCount
            }
          : c
      )
    );

  } catch (err) {

    alert(err.message);

  }
};

if (loading) return <div>Loading contestants...</div>;
  return (

    <div>

      <h2>Contestants</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: "20px"
        }}
      >

        {contestants.map((c) => (

          <div
            key={c.participationId}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px"
            }}
          >

            <img
              src={c.participantPhotoUrl}
              alt="contestant"
              width="100%"
              height="200"
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />

            <h3>{c.participantName}</h3>

            <p><b>Season:</b> {c.seasonName}</p>

            <p><b>Location:</b> {c.location}</p>

            <p><b>Votes:</b> {c.voteCount}</p>



            {/* ================= VOTE BUTTON ================= */}

            <button
              onClick={() => toggleVote(c.participationId)}
              style={{
                background: c.hasVoted === 1 ? "red" : "green",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              {c.hasVoted === 1 ? "Unvote" : "Vote Now"}
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}