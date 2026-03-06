import { useEffect, useState } from "react";

export default function Winners(){

const [winners,setWinners] = useState([]);
const [loading,setLoading] = useState(true);
const [error,setError] = useState(null);

const token = localStorage.getItem("token");

// ================= FETCH WINNERS =================

useEffect(()=>{

const fetchWinners = async()=>{

try{

const res = await fetch(
`${import.meta.env.VITE_BASE_URL}/winners`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const data = await res.json();

if(!res.ok){
throw new Error(data.message || "Failed to fetch winners");
}

setWinners(data);

}catch(err){

setError(err.message);

}finally{

setLoading(false);

}

};

fetchWinners();

},[token]);

// ================= UI STATES =================

if(loading) return <div>Loading winners...</div>;

if(error) return <div>Error: {error}</div>;

// ================= UI =================

return(

<div>

<h2>Season Winners</h2>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
gap:"20px"
}}
>

{winners.map(w=>(

<div
key={w.seasonId}
style={{
border:"1px solid #ddd",
borderRadius:"10px",
padding:"15px"
}}
>

<img
src={w.photoUrl}
alt="winner"
width="100%"
height="220"
style={{objectFit:"cover"}}
/>

<h3>{w.contestantName}</h3>

<p><b>Season:</b> {w.seasonName}</p>

<p><b>Total Votes:</b> {w.totalVotes}</p>

<p><b>Prize:</b> ₹{w.prizeMoney}</p>

</div>

))}

</div>

</div>

);

}