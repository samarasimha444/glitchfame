import { useState } from "react";

export default function Signup(){

const [email,setEmail] = useState("");
const [username,setUsername] = useState("");
const [password,setPassword] = useState("");
const [mobile,setMobile] = useState("");

const [otp,setOtp] = useState("");
const [otpSent,setOtpSent] = useState(false);

const sendOtp = async ()=>{

const res = await fetch("http://localhost:3000/auth/signup",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ email,username,password,mobile })
});

const data = await res.text();

alert(data);

if(res.ok){
setOtpSent(true);
}

};

const verifyOtp = async ()=>{

const res = await fetch(`http://localhost:3000/auth/verify-signup?otp=${otp}`,{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ email,username,password,mobile })
});

const data = await res.text();

alert(data);

};

return(
<div>

<h2>Signup</h2>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<input
placeholder="Mobile"
value={mobile}
onChange={(e)=>setMobile(e.target.value)}
/>

<button onClick={sendOtp}>Send OTP</button>

{otpSent && (

<div>

<h3>Enter OTP</h3>

<input
placeholder="OTP"
value={otp}
onChange={(e)=>setOtp(e.target.value)}
/>

<button onClick={verifyOtp}>Verify OTP</button>

</div>

)}

</div>
);
}