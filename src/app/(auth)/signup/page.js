"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNum, setContactNum] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          contactNum,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      console.log(data);

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 rounded-2xl bg-(--secondary)">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-black/5"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-black/5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Contact Number"
            className="w-full p-3 rounded-lg bg-black/5"
            value={contactNum}
            onChange={(e) => setContactNum(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-black/5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-(--primary) text-white p-3 rounded-lg cursor-pointer hover:opacity-90"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/signin")}
            className="text-(--primary) cursor-pointer underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}