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

if(!token) return;

const client = new Client({


brokerURL:`${import.meta.env.VITE_BASE_URL.replace("http","ws")}/ws`,

connectHeaders:{
    Authorization:`Bearer ${token}`
},

reconnectDelay:5000,

debug:()=>{}


});

client.onConnect = ()=>{


console.log("Leaderboard socket connected");

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

// ================= UI =================

return(

<div>

<h2>Live Season Leaders</h2>

{Object.values(grouped).map(seasonLeaders=>{

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

})}

</div>

);

}
