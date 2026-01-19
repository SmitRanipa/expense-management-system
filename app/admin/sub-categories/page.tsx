"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SubCategoriesPage() {
  const router = useRouter();
  const [subs, setSubs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/sub-categories")
      .then((r) => r.json())
      .then((d) => setSubs(d.data || []));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Sub Categories</h1>
        <Link href="/admin/sub-categories/add">
          <button>Add Sub Category</button>
        </Link>
      </div>

      <table width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Expense</th>
            <th>Income</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {subs.map((s) => (
            <tr key={s.SubCategoryID}>
              <td>{s.SubCategoryName}</td>
              <td>{s.category?.CategoryName}</td>
              <td>{s.IsExpense ? "Yes" : "No"}</td>
              <td>{s.IsIncome ? "Yes" : "No"}</td>
              <td>
                <button
                  onClick={() =>
                    router.push(`/admin/sub-categories/edit/${s.SubCategoryID}`)
                  }
                >
                  Edit
                </button>

                <button
                  style={{ marginLeft: 8, color: "red" }}
                  onClick={async () => {
                    if (!confirm("Delete sub category?")) return;
                    await fetch(
                      `/api/admin/sub-categories?id=${s.SubCategoryID}`,
                      { method: "DELETE" },
                    );
                    setSubs((p) =>
                      p.filter((x) => x.SubCategoryID !== s.SubCategoryID),
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
