"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/projects?id=${id}`)
      .then((r) => r.json())
      .then(setProject);
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();

    await fetch("/api/admin/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });

    router.push("/admin/projects");
  }

  if (!project) return <p>Loading...</p>;

  return (
    <form onSubmit={submit}>
      <h1>Edit Project</h1>

      <input
        value={project.ProjectName}
        onChange={(e) =>
          setProject({ ...project, ProjectName: e.target.value })
        }
      />

      <label>
        <input
          type="checkbox"
          checked={project.IsActive}
          onChange={() =>
            setProject({ ...project, IsActive: !project.IsActive })
          }
        />
        Active
      </label>

      <button type="submit">Update</button>
    </form>
  );
}
