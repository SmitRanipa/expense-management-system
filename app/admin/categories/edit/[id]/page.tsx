"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [cat, setCat] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/categories?id=${id}`)
      .then((r) => r.json())
      .then(setCat);
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();

    await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cat),
    });

    router.push("/admin/categories");
  }

  if (!cat) return <p>Loading...</p>;

  return (
    <form onSubmit={submit}>
      <h1>Edit Category</h1>

      <input
        value={cat.CategoryName}
        onChange={(e) =>
          setCat({ ...cat, CategoryName: e.target.value })
        }
      />

      <label>
        <input
          type="checkbox"
          checked={cat.IsExpense}
          onChange={() =>
            setCat({ ...cat, IsExpense: !cat.IsExpense })
          }
        />
        Expense
      </label>

      <label>
        <input
          type="checkbox"
          checked={cat.IsIncome}
          onChange={() =>
            setCat({ ...cat, IsIncome: !cat.IsIncome })
          }
        />
        Income
      </label>

      <button type="submit">Update</button>
    </form>
  );
}
