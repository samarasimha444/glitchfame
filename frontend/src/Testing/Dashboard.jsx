import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

export default function Dashboard() {

const [profile, setProfile] = useState(null);
const [contestants, setContestants] = useState([]);
const [wsStatus, setWsStatus] = useState("Disconnected");

/* change password */
const [showPasswordForm,setShowPasswordForm] = useState(false);
const [passwordForm,setPasswordForm] = useState({
currentPassword:"",
newPassword:""
});

/* forgot password flow */
const [showForgot,setShowForgot] = useState(false);
const [forgotEmail,setForgotEmail] = useState("");
const [otp,setOtp] = useState("");
const [newForgotPassword,setNewForgotPassword] = useState("");

const stompRef = useRef(null);

const inFlight = useRef({});
const desiredState = useRef({});
const rollbackRef = useRef({});

useEffect(()=>{

const token = localStorage.getItem("token");

/* fetch profile */
const fetchProfile = async () => {

const res = await fetch("http://localhost:3000/auth/profile",{
headers:{Authorization:`Bearer ${token}`}
});

const data = await res.json();
setProfile(data);

};

/* fetch contestants */

const fetchContestants = async ()=>{

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
stompRef.current = stompClient;

stompClient.subscribe("/topic/votes",(msg)=>{

const data = JSON.parse(msg.body);

setContestants(prev =>
prev.map(c =>
c.participationId === data.participationId
? {...c,totalVotes:data.votes}
: c
)
);

});

}

});

stompClient.activate();

return ()=>stompClient.deactivate();

},[]);


/* vote toggle */

const toggleVote = (contestant)=>{

const id = contestant.participationId;

desiredState.current[id] = !contestant.hasVoted;

setContestants(prev =>
prev.map(c =>
c.participationId === id
? {
...c,
hasVoted:desiredState.current[id],
totalVotes:desiredState.current[id]
? c.totalVotes+1
: Math.max(0,c.totalVotes-1)
}
: c
)
);

if(!inFlight.current[id]){
sendVoteRequest(contestant);
}

};


/* vote request */

const sendVoteRequest = async(contestant)=>{

const token = localStorage.getItem("token");
const id = contestant.participationId;

inFlight.current[id] = true;

rollbackRef.current[id] = {
hasVoted:contestant.hasVoted,
totalVotes:contestant.totalVotes
};

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

const msg = await res.text();
const rollback = rollbackRef.current[id];

setContestants(prev =>
prev.map(c =>
c.participationId === id
? {...c,...rollback}
: c
)
);

desiredState.current[id] = rollback.hasVoted;

alert(msg);

}

}catch{

const rollback = rollbackRef.current[id];

setContestants(prev =>
prev.map(c =>
c.participationId === id
? {...c,...rollback}
: c
)
);

desiredState.current[id] = rollback.hasVoted;

alert("Network error");

}

inFlight.current[id] = false;

};


/* change password */

const changePassword = async()=>{

const token = localStorage.getItem("token");

const res = await fetch("http://localhost:3000/auth/change-password",{

method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify(passwordForm)

});

const msg = await res.text();

alert(msg);

};


/* forgot password */

const sendForgotOtp = async()=>{

const res = await fetch(
`http://localhost:3000/auth/forgot-password?email=${forgotEmail}`,
{method:"POST"}
);

alert(await res.text());

};


const verifyForgotOtp = async()=>{

const res = await fetch(
`http://localhost:3000/auth/verify-forgot?email=${forgotEmail}&otp=${otp}`,
{method:"POST"}
);

alert(await res.text());

};


const resetForgotPassword = async()=>{

const res = await fetch(
`http://localhost:3000/auth/reset-password?email=${forgotEmail}&newPassword=${newForgotPassword}`,
{method:"POST"}
);

alert(await res.text());

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

<h3>Password Settings</h3>

<button onClick={()=>setShowPasswordForm(!showPasswordForm)}>
Change Password
</button>

<button onClick={()=>setShowForgot(!showForgot)}>
Forgot Password
</button>


{/* change password form */}

{showPasswordForm && (

<div style={{marginTop:10}}>

<input
type="password"
placeholder="Current password"
value={passwordForm.currentPassword}
onChange={e=>setPasswordForm({
...passwordForm,
currentPassword:e.target.value
})}
/>

<input
type="password"
placeholder="New password"
value={passwordForm.newPassword}
onChange={e=>setPasswordForm({
...passwordForm,
newPassword:e.target.value
})}
/>

<button onClick={changePassword}>
Update Password
</button>

</div>

)}


{/* forgot password flow */}

{showForgot && (

<div style={{marginTop:20}}>

<input
placeholder="Email"
value={forgotEmail}
onChange={e=>setForgotEmail(e.target.value)}
/>

<button onClick={sendForgotOtp}>
Send OTP
</button>

<br/><br/>

<input
placeholder="OTP"
value={otp}
onChange={e=>setOtp(e.target.value)}
/>

<button onClick={verifyForgotOtp}>
Verify OTP
</button>

<br/><br/>

<input
type="password"
placeholder="New Password"
value={newForgotPassword}
onChange={e=>setNewForgotPassword(e.target.value)}
/>

<button onClick={resetForgotPassword}>
Reset Password
</button>

</div>

)}

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