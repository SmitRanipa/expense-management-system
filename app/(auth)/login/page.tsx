"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type LoginRole = "ADMIN" | "EMPLOYEE";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<LoginRole>("ADMIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * ✅ If user is already authenticated
   * 👉 Let middleware decide correct dashboard
   */
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  /**
   * ⏳ Prevent UI flash while checking session
   */
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      role, // 🔥 role sent to NextAuth
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials or role");
      return;
    }

    /**
     * ✅ DO NOT redirect here
     * Middleware will redirect based on role
     */
    router.replace("/");
  }

  return (
    <div style={{ maxWidth: 420, margin: "100px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        {/* ROLE SELECTION */}
        <div style={{ marginBottom: 15 }}>
          <label>
            <input
              type="radio"
              value="ADMIN"
              checked={role === "ADMIN"}
              onChange={() => setRole("ADMIN")}
            />
            Admin
          </label>

          <label style={{ marginLeft: 20 }}>
            <input
              type="radio"
              value="EMPLOYEE"
              checked={role === "EMPLOYEE"}
              onChange={() => setRole("EMPLOYEE")}
            />
            Employee
          </label>
        </div>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginTop: 10 }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ marginTop: 20 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
