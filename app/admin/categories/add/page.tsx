"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [expense, setExpense] = useState(true);
  const [income, setIncome] = useState(false);

  async function submit(e: any) {
    e.preventDefault();

    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        CategoryName: name,
        IsExpense: expense,
        IsIncome: income,
      }),
    });

    router.push("/admin/categories");
  }

  return (
    <form onSubmit={submit}>
      <h1>Add Category</h1>

      <input
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

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
