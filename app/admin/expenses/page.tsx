import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ExpensesClient } from "@/components/expenses/ExpensesClient";

export default async function AdminExpensesPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/employee/dashboard");

  const expenses = await prisma.expenses.findMany({
    where: { IsDeleted: false, UserID: session.user.ownerId },
    select: {
      ExpenseID: true,
      ExpenseDate: true,
      Amount: true,
      Description: true,
      ExpenseDetail: true,
      AttachmentPath: true,
      CategoryID: true,
      SubCategoryID: true,
      ProjectID: true,
      PeopleID: true,
      category: { select: { CategoryName: true } },
      subCategory: { select: { SubCategoryName: true } },
      project: { select: { ProjectName: true } },
      people: { select: { PeopleName: true } },
    },
    orderBy: { ExpenseDate: "desc" },
  });

  const rows = expenses.map((e) => ({
    ExpenseID: e.ExpenseID,
    ExpenseDate: e.ExpenseDate.toISOString(),
    Amount: e.Amount.toString(),
    Description: e.Description ?? null,
    ExpenseDetail: e.ExpenseDetail ?? null,
    AttachmentPath: e.AttachmentPath ?? null,
    CategoryID: e.CategoryID ?? undefined,
    SubCategoryID: e.SubCategoryID ?? undefined,
    ProjectID: e.ProjectID ?? undefined,
    PeopleID: e.PeopleID ?? undefined,
    category: e.category ? { CategoryName: e.category.CategoryName } : undefined,
    subCategory: e.subCategory ? { SubCategoryName: e.subCategory.SubCategoryName } : undefined,
    project: e.project ? { ProjectName: e.project.ProjectName } : undefined,
    people: e.people ? { PeopleName: e.people.PeopleName } : undefined,
  }));

  return <ExpensesClient initialData={rows} isAdmin={true} />;
}
