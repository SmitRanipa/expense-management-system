"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TxType = "expense" | "income";

type MetaCategory = { CategoryID: number; CategoryName: string };
type MetaSub = { SubCategoryID: number; SubCategoryName: string; CategoryID: number };
type MetaProject = { ProjectID: number; ProjectName: string };

export type TransactionFormInitial = {
  id?: number;
  date?: string; // YYYY-MM-DD
  amount?: string;
  categoryId?: number | null;
  subCategoryId?: number | null;
  projectId?: number | null;
  detail?: string | null;
  attachmentPath?: string | null;
  description?: string | null;
};

export default function TransactionForm({
  type,
  mode,
  initial,
  backTo,
}: {
  type: TxType;
  mode: "add" | "edit";
  initial?: TransactionFormInitial;
  backTo: string; // "/employee/expenses" etc
}) {
  const router = useRouter();
  const api = type === "expense" ? "/api/expenses" : "/api/incomes";

  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState(initial?.amount ?? "");
  const [categoryId, setCategoryId] = useState<string>(initial?.categoryId ? String(initial.categoryId) : "");
  const [subCategoryId, setSubCategoryId] = useState<string>(initial?.subCategoryId ? String(initial.subCategoryId) : "");
  const [projectId, setProjectId] = useState<string>(initial?.projectId ? String(initial.projectId) : "");
  const [detail, setDetail] = useState(initial?.detail ?? "");
  const [attachmentPath, setAttachmentPath] = useState(initial?.attachmentPath ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  const [categories, setCategories] = useState<MetaCategory[]>([]);
  const [subs, setSubs] = useState<MetaSub[]>([]);
  const [projects, setProjects] = useState<MetaProject[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/meta/categories").then((r) => r.json()),
      fetch("/api/meta/sub-categories").then((r) => r.json()),
      fetch("/api/meta/projects").then((r) => r.json()),
    ]).then(([c, sc, pr]) => {
      setCategories(c.data || []);
      setSubs(sc.data || []);
      setProjects(pr.data || []);
    });
  }, []);

  const filteredSubs = useMemo(() => {
    if (!categoryId) return subs;
    return subs.filter((s) => String(s.CategoryID) === String(categoryId));
  }, [subs, categoryId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload: any =
      type === "expense"
        ? {
            ExpenseDate: date,
            Amount: amount, // ✅ keep as string; API converts to Decimal
            CategoryID: categoryId ? Number(categoryId) : null,
            SubCategoryID: subCategoryId ? Number(subCategoryId) : null,
            ProjectID: projectId ? Number(projectId) : null,
            ExpenseDetail: detail || null,
            AttachmentPath: attachmentPath || null,
            Description: description || null,
          }
        : {
            IncomeDate: date,
            Amount: amount,
            CategoryID: categoryId ? Number(categoryId) : null,
            SubCategoryID: subCategoryId ? Number(subCategoryId) : null,
            ProjectID: projectId ? Number(projectId) : null,
            IncomeDetail: detail || null,
            AttachmentPath: attachmentPath || null,
            Description: description || null,
          };

    // for edit, include ID (your PUT expects full object)
    if (mode === "edit" && initial?.id) {
      payload[type === "expense" ? "ExpenseID" : "IncomeID"] = initial.id;
    }

    await fetch(api, {
      method: mode === "add" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    router.push(backTo);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Amount is stored as Decimal (safe for finance).
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category (optional)</label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSubCategoryId("");
            }}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.CategoryID} value={c.CategoryID}>
                {c.CategoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sub Category (optional)</label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={subCategoryId}
            onChange={(e) => setSubCategoryId(e.target.value)}
          >
            <option value="">Select sub category</option>
            {filteredSubs.map((s) => (
              <option key={s.SubCategoryID} value={s.SubCategoryID}>
                {s.SubCategoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Project (optional)</label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p.ProjectID} value={p.ProjectID}>
                {p.ProjectName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">
            {type === "expense" ? "Expense Detail" : "Income Detail"} (optional)
          </label>
          <Textarea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="More details..." />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Attachment Path (optional)</label>
          <Input
            value={attachmentPath}
            onChange={(e) => setAttachmentPath(e.target.value)}
            placeholder="Paste file URL/path for now (we can add upload later)"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Description (optional)</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Notes..." />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "add" ? "Save" : "Update"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(backTo)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
