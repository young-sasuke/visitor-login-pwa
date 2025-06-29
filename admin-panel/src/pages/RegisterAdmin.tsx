import { useState } from "react";
import { supabase } from "../supabaseClient"; // adjust path if different

export default function RegisterAdmin() {
  const [email, setEmail] = useState("uttamanand4469@gmail.com");
  const [password, setPassword] = useState("Admin@123");
  const [status, setStatus] = useState("");

  const register = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setStatus("❌ Error: " + error.message);
    } else {
      setStatus("✅ Registration successful. Try logging in now.");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Manual Admin Register</h2>
      <button onClick={register}>Register `uttamanand4469@gmail.com`</button>
      <p>{status}</p>
    </div>
  );
}
