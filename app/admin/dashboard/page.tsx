"use client";

import { useSession } from "next-auth/react";

export default function AdminDashboardPage() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div style={{ marginTop: 30 }}>
      <h1>Admin Dashboard</h1>

      <p><strong>Name:</strong> {session.user.name}</p>
      <p><strong>Email:</strong> {session.user.email}</p>
      <p><strong>Role:</strong> {session.user.role}</p>
      <p><strong>Owner ID:</strong> {session.user.ownerId}</p>

      <p style={{ marginTop: 20 }}>
        (Later: statistics, charts, summaries)
      </p>
    </div>
  );
}
