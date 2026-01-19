"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Categories</h1>
        <Link href="/admin/categories/add">
          <button>Add Category</button>
        </Link>
      </div>

      <table width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Expense</th>
            <th>Income</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c) => (
            <tr key={c.CategoryID}>
              <td>{c.CategoryName}</td>
              <td>{c.IsExpense ? "Yes" : "No"}</td>
              <td>{c.IsIncome ? "Yes" : "No"}</td>
              <td>
                <button
                  onClick={() =>
                    router.push(`/admin/categories/edit/${c.CategoryID}`)
                  }
                >
                  Edit
                </button>

                <button
                  style={{ marginLeft: 8, color: "red" }}
                  onClick={async () => {
                    if (!confirm("Delete category?")) return;
                    await fetch(
                      `/api/admin/categories?id=${c.CategoryID}`,
                      { method: "DELETE" },
                    );
                    setCategories((prev) =>
                      prev.filter((x) => x.CategoryID !== c.CategoryID),
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
