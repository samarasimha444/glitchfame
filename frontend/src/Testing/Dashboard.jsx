import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

export default function Dashboard(){

const [profile,setProfile] = useState(null);
const [contestants,setContestants] = useState([]);
const [wsStatus,setWsStatus] = useState("Disconnected");

const stompRef = useRef(null);

/* voting control */
const inFlight = useRef({});
const desiredState = useRef({});

useEffect(()=>{

const token = localStorage.getItem("token");

/* load profile */

const fetchProfile = async()=>{

const res = await fetch("http://localhost:3000/auth/profile",{
headers:{Authorization:`Bearer ${token}`}
});

setProfile(await res.json());

};

/* load contestants */

const fetchContestants = async()=>{

const res = await fetch(
"http://localhost:3000/participations/live?page=0&size=50",
{headers:{Authorization:`Bearer ${token}`}}
);

const data = await res.json();
setContestants(data.content);

};

fetchProfile();
fetchContestants();

/* websocket */

const stompClient = new Client({

brokerURL:"ws://localhost:3000/ws",
connectHeaders:{Authorization:`Bearer ${token}`},
reconnectDelay:5000,

onConnect:()=>{

setWsStatus("Connected");

stompClient.subscribe("/topic/votes",(msg)=>{

const data = JSON.parse(msg.body);

/*
Expected server payload

{
participationId,
votes,
userVoted
}
*/

setContestants(prev =>
prev.map(c =>
c.participationId === data.participationId
? {
...c,
totalVotes:data.votes,
...(data.userVoted !== undefined && {hasVoted:data.userVoted})
}
: c
)
);

}

});

});

stompClient.activate();

return ()=>stompClient.deactivate();

},[]);



/* vote toggle */

const toggleVote = (contestant)=>{

const id = contestant.participationId;

/* determine next desired state */

const currentDesired =
desiredState.current[id] ?? contestant.hasVoted;

desiredState.current[id] = !currentDesired;

/* optimistic UI */

setContestants(prev =>
prev.map(c =>
c.participationId === id
? {
...c,
hasVoted:desiredState.current[id],
totalVotes: desiredState.current[id]
? c.totalVotes+1
: Math.max(0,c.totalVotes-1)
}
: c
)
);

/* send request if not running */

if(!inFlight.current[id]){
sendVoteRequest(contestant);
}

};



/* vote request */

const sendVoteRequest = async(contestant)=>{

const token = localStorage.getItem("token");
const id = contestant.participationId;

inFlight.current[id] = true;

try{

const res = await fetch("http://localhost:3000/votes",{

method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
participationId:contestant.participationId,
seasonId:contestant.seasonId
})

});

if(!res.ok){
alert(await res.text());
}

}catch{
alert("Network error");
}

inFlight.current[id] = false;

/* check if user tapped again while request running */

setContestants(prev=>{

const current = prev.find(c=>c.participationId===id);

if(current && desiredState.current[id] !== current.hasVoted){
sendVoteRequest(current);
}

return prev;

});

};



if(!profile) return <div>Loading...</div>;

return(

<div style={{padding:20}}>

<h2>Dashboard</h2>

<p><b>WebSocket:</b> {wsStatus}</p>

<h3>Profile</h3>

<p><b>ID:</b> {profile.id}</p>
<p><b>Email:</b> {profile.email}</p>

<hr/>

<h3>Live Contestants</h3>

{contestants.map(c=>(

<div key={c.participationId}
style={{
border:"1px solid #ccc",
padding:10,
marginBottom:10,
width:300
}}>

<img src={c.participantPhotoUrl} width="150"/>

<p><b>Name:</b> {c.participantName}</p>
<p><b>Total Votes:</b> {c.totalVotes}</p>

<button
onClick={()=>toggleVote(c)}
style={{
background:c.hasVoted ? "#ff4d4d" : "#4CAF50",
color:"white",
border:"none",
padding:"6px 12px"
}}
>

{c.hasVoted ? "Unvote":"Vote"}

</button>

</div>

))}

</div>

);

}