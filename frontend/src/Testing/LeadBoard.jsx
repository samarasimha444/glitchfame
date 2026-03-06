import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

export default function Leadboard(){

const [leaders,setLeaders] = useState([]);
const [loading,setLoading] = useState(true);
const [error,setError] = useState(null);

const token = localStorage.getItem("token");

// ================= FETCH LEADERBOARD =================

useEffect(()=>{

const fetchLeaderboard = async()=>{

try{

    const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/leaderboard`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const data = await res.json();

    if(!res.ok){
        throw new Error(data.message || "Failed to fetch leaderboard");
    }

    setLeaders(data);

}catch(err){

    setError(err.message);

}finally{

    setLoading(false);

}

};

fetchLeaderboard();

},[token]);

// ================= WEBSOCKET =================

useEffect(()=>{

if(!token || leaders.length === 0) return;

const client = new Client({

brokerURL:`${import.meta.env.VITE_BASE_URL.replace("http","ws")}/ws`,

connectHeaders:{
    Authorization:`Bearer ${token}`
},

reconnectDelay:5000,

debug:()=>{}

});

client.onConnect = ()=>{

const seasonIds = [...new Set(leaders.map(l=>l.season_id))];

seasonIds.forEach(seasonId=>{

    client.subscribe(`/topic/leaderboard/${seasonId}`, message=>{

        const updated = JSON.parse(message.body);

        setLeaders(prev=>{

            const others = prev.filter(
                l=>l.season_id !== seasonId
            );

            return [...others,...updated];

        });

    });

});

};

client.activate();

return ()=> client.deactivate();

},[leaders,token]);

// ================= UI STATES =================

if(loading) return <div>Loading leaderboard...</div>;

if(error) return <div>Error: {error}</div>;

// ================= GROUP BY SEASON =================

const grouped = leaders.reduce((acc,item)=>{

if(!acc[item.season_id]){
acc[item.season_id] = [];
}

acc[item.season_id].push(item);

return acc;

},{});

// ================= SPLIT LIVE / PAST =================

const now = new Date();

const liveSeasons = [];
const pastSeasons = [];

Object.values(grouped).forEach(seasonLeaders=>{

const season = seasonLeaders[0];

const votingEnd = new Date(season.voting_end_date);

if(now <= votingEnd){
liveSeasons.push(seasonLeaders);
}else{
pastSeasons.push(seasonLeaders);
}

});

// ================= RENDER SEASON BLOCK =================

const renderSeason = (seasonLeaders)=>{

const season = seasonLeaders[0];

return(

<div key={season.season_id} style={{marginBottom:"40px"}}>

<h3>{season.season_name}</h3>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
gap:"20px"
}}
>

{seasonLeaders.map(l=>(

<div
key={l.participation_id}
style={{
border:"1px solid #ddd",
borderRadius:"10px",
padding:"10px"
}}
>

<img
src={l.photo_url}
alt="contestant"
width="100%"
height="200"
style={{objectFit:"cover"}}
/>

<h4>{l.participant_name}</h4>

<p><b>Location:</b> {l.location}</p>

<p><b>Votes:</b> {l.vote_count}</p>

<p><b>Rank:</b> #{l.rank_position}</p>

</div>

))}

</div>

</div>

);

};

// ================= UI =================

return(

<div>

<h2>Live Seasons</h2>

{liveSeasons.length === 0 && <p>No live seasons</p>}

{liveSeasons.map(renderSeason)}


<h2 style={{marginTop:"50px"}}>Past Seasons</h2>

{pastSeasons.length === 0 && <p>No past seasons</p>}

{pastSeasons.map(renderSeason)}

</div>

);

}