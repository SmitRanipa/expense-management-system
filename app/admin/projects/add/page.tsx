"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  async function submit(e: any) {
    e.preventDefault();

    await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ProjectName: name }),
    });

    router.push("/admin/projects");
  }

  return (
    <form onSubmit={submit}>
      <h1>Add Project</h1>

      <input
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <button type="submit">Save</button>
    </form>
  );
}
