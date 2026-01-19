"use client";

import { useSession } from "next-auth/react";

export default function EmployeeDashboardPage() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div style={{ marginTop: 30 }}>
      <h1>Employee Dashboard</h1>

      <p><strong>Name:</strong> {session.user.name}</p>
      <p><strong>Email:</strong> {session.user.email}</p>
      <p><strong>Role:</strong> {session.user.role}</p>
      <p><strong>Owner ID:</strong> {session.user.ownerId}</p>
      <p><strong>People ID:</strong> {session.user.peopleId}</p>

      <p style={{ marginTop: 20 }}>
        (Later: personal expenses & income)
      </p>
    </div>
  );
}
