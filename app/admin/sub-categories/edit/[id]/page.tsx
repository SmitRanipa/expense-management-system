"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditSubCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [sub, setSub] = useState<any>(null);
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/admin/sub-categories?id=${id}`)
      .then((r) => r.json())
      .then(setSub);

    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCats(d.data || []));
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();

    await fetch("/api/admin/sub-categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });

    router.push("/admin/sub-categories");
  }

  if (!sub) return <p>Loading...</p>;

  return (
    <form onSubmit={submit}>
      <h1>Edit Sub Category</h1>

      <input
        value={sub.SubCategoryName}
        onChange={(e) =>
          setSub({ ...sub, SubCategoryName: e.target.value })
        }
      />

      <select
        value={sub.CategoryID}
        onChange={(e) =>
          setSub({ ...sub, CategoryID: Number(e.target.value) })
        }
      >
        {cats.map((c) => (
          <option key={c.CategoryID} value={c.CategoryID}>
            {c.CategoryName}
          </option>
        ))}
      </select>

      <label>
        <input
          type="checkbox"
          checked={sub.IsExpense}
          onChange={() =>
            setSub({ ...sub, IsExpense: !sub.IsExpense })
          }
        />
        Expense
      </label>

      <label>
        <input
          type="checkbox"
          checked={sub.IsIncome}
          onChange={() =>
            setSub({ ...sub, IsIncome: !sub.IsIncome })
          }
        />
        Income
      </label>

      <button type="submit">Update</button>
    </form>
  );
}
