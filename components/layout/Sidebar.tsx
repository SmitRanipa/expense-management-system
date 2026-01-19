"use client";

import { useSession } from "next-auth/react";
import SidebarItem from "../navigation/SidebarItem";

export default function Sidebar() {
  const { data: session } = useSession();
  const role = session?.user.role;

  return (
    <aside
      style={{
        width: 220,
        borderRight: "1px solid var(--border)",
        padding: 20,
      }}
    >
      <ul style={{ listStyle: "none", padding: 0, lineHeight: "2rem" }}>
        {role === "ADMIN" && (
          <>
            <SidebarItem href="/admin/dashboard" label="Dashboard" />
            <SidebarItem href="/admin/peoples" label="Peoples" />
            <SidebarItem href="/admin/categories" label="Categories" />
            <SidebarItem href="/admin/sub-categories" label="Sub Categories" />
            <SidebarItem href="/admin/projects" label="Projects" />
            <SidebarItem href="/admin/expenses" label="Expenses" />
            <SidebarItem href="/admin/incomes" label="Incomes" />
          </>
        )}

        {role === "EMPLOYEE" && (
          <>
            <SidebarItem href="/employee/dashboard" label="Dashboard" />
            <SidebarItem href="/employee/expenses" label="Expenses" />
            <SidebarItem href="/employee/incomes" label="Incomes" />
          </>
        )}
      </ul>
    </aside>
  );
}
