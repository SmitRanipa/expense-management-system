"use client";

import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <strong>Expense Manager</strong>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <ThemeToggle />

        <div>
          <div>{session?.user.email}</div>
          <small>{session?.user.role}</small>
        </div>

        <button onClick={() => signOut({ callbackUrl: "/login" })}>
          Logout
        </button>
      </div>
    </header>
  );
}
