"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPeoplePage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/peoples?id=${id}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load");
        setLoading(false);
        return;
      }

      setName(data.PeopleName);
      setEmail(data.Email);
      setMobile(data.MobileNo);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/admin/peoples", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        PeopleID: Number(id),
        PeopleName: name,
        Email: email,
        MobileNo: mobile,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Update failed");
      return;
    }

    router.push("/admin/peoples");
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 420 }}>
      <h1>Edit People</h1>

      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginTop: 10 }}
        />
        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          style={{ marginTop: 10 }}
        />

        <button type="submit" style={{ marginTop: 20 }}>
          Update
        </button>
      </form>
    </div>
  );
}
