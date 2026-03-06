import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";

export default function TestSeasonId() {


const { seasonId } = useParams();
const navigate = useNavigate();

const [season, setSeason] = useState(null);
const [contestants, setContestants] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const token = localStorage.getItem("token");



// ================= FETCH SEASON + CONTESTANTS =================

useEffect(() => {

    const fetchData = async () => {

        try {

            const seasonRes = await fetch(
                `${import.meta.env.VITE_BASE_URL}/seasons/${seasonId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!seasonRes.ok) {
                const err = await seasonRes.json();
                throw new Error(err.message || "Failed to fetch season");
            }

            const seasonData = await seasonRes.json();
            setSeason(seasonData);



            const contestantsRes = await fetch(
                `${import.meta.env.VITE_BASE_URL}/contestants/season/${seasonId}?page=0&size=50`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!contestantsRes.ok) {
                const err = await contestantsRes.json();
                throw new Error(err.message || "Failed to fetch contestants");
            }

            const contestantsData = await contestantsRes.json();

            setContestants(contestantsData.content || []);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }

    };

    fetchData();

}, [seasonId, token]);



// ================= WEBSOCKET =================

useEffect(() => {

    if (!token) return;

    const client = new Client({

        brokerURL: `${import.meta.env.VITE_BASE_URL.replace("http", "ws")}/ws`,

        connectHeaders: {
            Authorization: `Bearer ${token}`
        },

        reconnectDelay: 5000,

        debug: () => {}

    });


    client.onConnect = () => {

        console.log("WebSocket connected");

        client.subscribe("/topic/votes", (message) => {

            let update;

            try {
                update = JSON.parse(message.body);
            } catch {
                console.warn("Invalid WS message:", message.body);
                return;
            }

            const { participationId, voteCount } = update;

            if (!participationId) return;

            setContestants(prev =>
                prev.map(c =>
                    c.id === participationId
                        ? { ...c, totalVotes: voteCount }
                        : c
                )
            );

        });

    };


    client.onStompError = (frame) => {

        console.error("Broker error:", frame.headers["message"]);

    };


    client.activate();

    return () => {

        client.deactivate();

    };

}, [token]);



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

        const body = await res.json();

        if (!res.ok) {
            throw new Error(body.message || "Vote failed");
        }

        setContestants(prev =>
            prev.map(c =>
                c.id === participationId
                    ? { ...c, hasVoted: body.hasVoted ? 1 : 0 }
                    : c
            )
        );

    } catch (err) {

        alert(err.message);

    }

};



// ================= UI STATES =================

if (loading) return <div>Loading season...</div>;

if (error) return <div>Error: {error}</div>;

if (!season) return <div>Season not found</div>;



// ================= UI =================

return (

    <div>

        {/* SEASON INFO */}

        <h2>{season.name}</h2>

        <p><b>Prize Money:</b> {season.prizeMoney}</p>

        <p><b>Participation Status:</b> {season.participationStatus}</p>

        {season.photoUrl && (
            <img src={season.photoUrl} alt="season" width="300" />
        )}


        {season.participationStatus === "NOT_PARTICIPATED" && (

            <button
                onClick={() => navigate(`/testing-participation/${seasonId}`)}
            >
                Participate Now
            </button>

        )}



        {/* CONTESTANTS */}

        <h3 style={{ marginTop: "40px" }}>Contestants</h3>

        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
                gap: "20px"
            }}
        >

            {contestants.map(c => (

                <div
                    key={c.id}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "10px"
                    }}
                >

                    <img
                        src={c.photoUrl}
                        alt="contestant"
                        width="100%"
                        height="200"
                        style={{ objectFit: "cover" }}
                    />

                    <h4>{c.name}</h4>

                    <p><b>Location:</b> {c.location}</p>

                    <p><b>Votes:</b> {c.totalVotes ?? 0}</p>

                    <button
                        onClick={() => toggleVote(c.id)}
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
