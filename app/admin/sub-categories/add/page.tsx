"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddSubCategoryPage() {
  const router = useRouter();
  const [cats, setCats] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [catId, setCatId] = useState<number>();
  const [expense, setExpense] = useState(true);
  const [income, setIncome] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCats(d.data || []));
  }, []);

  async function submit(e: any) {
    e.preventDefault();

    await fetch("/api/admin/sub-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        SubCategoryName: name,
        CategoryID: catId,
        IsExpense: expense,
        IsIncome: income,
      }),
    });

    router.push("/admin/sub-categories");
  }

  return (
    <form onSubmit={submit}>
      <h1>Add Sub Category</h1>

      <input
        placeholder="Sub Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <select
        value={catId}
        onChange={(e) => setCatId(Number(e.target.value))}
        required
      >
        <option value="">Select Category</option>
        {cats.map((c) => (
          <option key={c.CategoryID} value={c.CategoryID}>
            {c.CategoryName}
          </option>
        ))}
      </select>

      <label>
        <input
          type="checkbox"
          checked={expense}
          onChange={() => setExpense(!expense)}
        />
        Expense
      </label>

      <label>
        <input
          type="checkbox"
          checked={income}
          onChange={() => setIncome(!income)}
        />
        Income
      </label>

      <button type="submit">Save</button>
    </form>
  );
}
