import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const navigate = useNavigate();

const login = async () => {

const res = await fetch("http://localhost:3000/auth/login",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ email,password })
});

const token = await res.text();

if(res.ok){

// store JWT
localStorage.setItem("token",token);

// redirect
navigate("/dashboard");

}else{

alert(token);

}

};

return (
<div>

<h2>Login</h2>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={login}>Login</button>

<a href="/forgot">Forgot Password?</a>

</div>
);
}