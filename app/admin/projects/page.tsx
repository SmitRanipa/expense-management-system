"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.data || []));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Projects</h1>
        <Link href="/admin/projects/add">
          <button>Add Project</button>
        </Link>
      </div>

      <table width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => (
            <tr key={p.ProjectID}>
              <td>{p.ProjectName}</td>
              <td>{p.IsActive ? "Active" : "Inactive"}</td>
              <td>
                <button
                  onClick={() =>
                    router.push(`/admin/projects/edit/${p.ProjectID}`)
                  }
                >
                  Edit
                </button>

                <button
                  style={{ marginLeft: 8, color: "red" }}
                  onClick={async () => {
                    if (!confirm("Delete project?")) return;
                    await fetch(
                      `/api/admin/projects?id=${p.ProjectID}`,
                      { method: "DELETE" }
                    );
                    setProjects((prev) =>
                      prev.filter((x) => x.ProjectID !== p.ProjectID)
                    );
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
