import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TestSeasonId(){

    const { seasonId } = useParams();
    const navigate = useNavigate();

    const [season, setSeason] = useState(null);
    const [contestants, setContestants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");


    // ================= LOAD DATA =================

    useEffect(() => {

        const fetchData = async () => {

            try {

                // ===== FETCH SEASON =====

                const seasonRes = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/seasons/${seasonId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (!seasonRes.ok) throw new Error("Failed to fetch season");

                const seasonData = await seasonRes.json();
                setSeason(seasonData);


                // ===== FETCH CONTESTANTS =====

                const contestantsRes = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/contestants/season/${seasonId}?page=0&size=50`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (!contestantsRes.ok) throw new Error("Failed to fetch contestants");

                const contestantsData = await contestantsRes.json();

                setContestants(contestantsData.content);

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, [seasonId]);



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

        const text = await res.text(); // read raw response

        let data;

        try {
            data = JSON.parse(text); // try parse json
        } catch {
            throw new Error(text); // backend returned plain text error
        }

        if (!res.ok) {
            throw new Error(data.message || "Vote failed");
        }

        // update UI
        setContestants(prev =>
            prev.map(c =>
                c.participationId === participationId
                    ? {
                        ...c,
                        voteCount: data.voteCount,
                        hasVoted: data.hasVoted ? 1 : 0
                    }
                    : c
            )
        );

    } catch (err) {

        alert(err.message);

    }

};


    if (loading) return <div>Loading season...</div>;
    if (error) return <div>Error: {error}</div>;



    return (

        <div>

            {/* ================= SEASON INFO ================= */}

            <h2>{season.name}</h2>

            <p><b>Prize Money:</b> {season.prizeMoney}</p>
            <p><b>Participation Status:</b> {season.participationStatus}</p>

            {season.photoUrl && (
                <img src={season.photoUrl} alt="season" width="300"/>
            )}

            {season.participationStatus === "NOT_PARTICIPATED" && (
                <button
                    onClick={() => navigate(`/testing-participation/${seasonId}`)}
                >
                    Participate Now
                </button>
            )}


            {/* ================= CONTESTANTS ================= */}

            <h3 style={{marginTop:"40px"}}>Contestants</h3>

            <div
                style={{
                    display:"grid",
                    gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
                    gap:"20px"
                }}
            >

                {contestants.map(c => (

                    <div
                        key={c.participationId}
                        style={{
                            border:"1px solid #ddd",
                            borderRadius:"10px",
                            padding:"10px"
                        }}
                    >

                        <img
                            src={c.participantPhotoUrl}
                            alt="contestant"
                            width="100%"
                            height="200"
                            style={{objectFit:"cover"}}
                        />

                        <h4>{c.participantName}</h4>

                        <p><b>Location:</b> {c.location}</p>

                        <p><b>Votes:</b> {c.voteCount}</p>


                        {/* ===== VOTE BUTTON ===== */}

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
                            {c.hasVoted === 1 ? "Unvote" : "Vote"}
                        </button>

                    </div>

                ))}

            </div>

        </div>

    );

}