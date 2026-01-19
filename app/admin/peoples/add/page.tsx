"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPeoplePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/peoples", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        mobile,
        password,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Failed to add people");
      return;
    }

    router.push("/admin/peoples");
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h1>Add People</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginTop: 10 }}
        />

        <input
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          style={{ marginTop: 10 }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginTop: 10 }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ marginTop: 20 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/peoples")}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
