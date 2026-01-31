import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { IncomesClient } from "@/components/incomes/IncomesClient";

export default async function AdminIncomesPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/employee/dashboard");

  const incomes = await prisma.incomes.findMany({
    where: { IsDeleted: false, UserID: session.user.ownerId },
    select: {
      IncomeID: true,
      IncomeDate: true,
      Amount: true,
      Description: true,
      IncomeDetail: true,
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
    orderBy: { IncomeDate: "desc" },
  });

  const rows = incomes.map((i) => ({
    IncomeID: i.IncomeID,
    IncomeDate: i.IncomeDate.toISOString(),
    Amount: i.Amount.toString(),
    Description: i.Description ?? null,
    IncomeDetail: i.IncomeDetail ?? null,
    AttachmentPath: i.AttachmentPath ?? null,
    CategoryID: i.CategoryID ?? undefined,
    SubCategoryID: i.SubCategoryID ?? undefined,
    ProjectID: i.ProjectID ?? undefined,
    PeopleID: i.PeopleID ?? undefined,
    category: i.category ? { CategoryName: i.category.CategoryName } : undefined,
    subCategory: i.subCategory ? { SubCategoryName: i.subCategory.SubCategoryName } : undefined,
    project: i.project ? { ProjectName: i.project.ProjectName } : undefined,
    people: i.people ? { PeopleName: i.people.PeopleName } : undefined,
  }));

  return <IncomesClient initialData={rows} isAdmin={true} />;
}
