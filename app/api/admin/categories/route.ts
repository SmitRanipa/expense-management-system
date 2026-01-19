import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // SINGLE (EDIT)
    if (id) {
      const category = await prisma.categories.findFirst({
        where: {
          CategoryID: Number(id),
          UserID: session.user.ownerId,
          IsDeleted: false,
        },
      });

      if (!category) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(category);
    }

    // LIST
    const categories = await prisma.categories.findMany({
      where: {
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
      orderBy: { Sequence: "asc" },
    });

    return NextResponse.json({ data: categories });
  } catch (e) {
    console.error("Categories GET Error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      CategoryName,
      IsExpense,
      IsIncome,
      Description,
      Sequence,
    } = body;

    if (!CategoryName) {
      return NextResponse.json(
        { message: "Category name required" },
        { status: 400 },
      );
    }

    const category = await prisma.categories.create({
      data: {
        CategoryName,
        IsExpense: !!IsExpense,
        IsIncome: !!IsIncome,
        Description,
        Sequence,
        IsActive: true,
        UserID: session.user.ownerId,
      },
    });

    await prisma.logs.create({
      data: {
        UserID: session.user.ownerId,
        ActionType: "ADD_CATEGORY",
        EntityName: "categories",
        EntityID: category.CategoryID,
        NewData: JSON.stringify(category),
      },
    });

    return NextResponse.json({ message: "Category added" });
  } catch (e) {
    console.error("Category POST Error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      CategoryID,
      CategoryName,
      IsExpense,
      IsIncome,
      Description,
      Sequence,
    } = body;

    const existing = await prisma.categories.findFirst({
      where: {
        CategoryID,
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.categories.update({
      where: { CategoryID },
      data: {
        CategoryName,
        IsExpense,
        IsIncome,
        Description,
        Sequence,
      },
    });

    await prisma.logs.create({
      data: {
        UserID: session.user.ownerId,
        ActionType: "UPDATE_CATEGORY",
        EntityName: "categories",
        EntityID: CategoryID,
        OldData: JSON.stringify(existing),
        NewData: JSON.stringify(updated),
      },
    });

    return NextResponse.json({ message: "Category updated" });
  } catch (e) {
    console.error("Category PATCH Error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    const category = await prisma.categories.findFirst({
      where: {
        CategoryID: id,
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    await prisma.categories.update({
      where: { CategoryID: id },
      data: { IsDeleted: true },
    });

    await prisma.logs.create({
      data: {
        UserID: session.user.ownerId,
        ActionType: "DELETE_CATEGORY",
        EntityName: "categories",
        EntityID: id,
        OldData: JSON.stringify(category),
      },
    });

    return NextResponse.json({ message: "Category deleted" });
  } catch (e) {
    console.error("Category DELETE Error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
