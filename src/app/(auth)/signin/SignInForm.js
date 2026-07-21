"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        const redirect = searchParams.get("redirect") || "/";
        router.replace(redirect);
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
          Sign In
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-black/5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            className="w-full bg-(--primary) text-white p-3 rounded-lg cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-(--primary) cursor-pointer underline"
          >
            Sign up
          </span>
        </p>

        
      </div>
    </div>
  );
}