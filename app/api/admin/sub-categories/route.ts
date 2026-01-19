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
      const sub = await prisma.sub_categories.findFirst({
        where: {
          SubCategoryID: Number(id),
          UserID: session.user.ownerId,
          IsDeleted: false,
        },
      });

      if (!sub) {
        return NextResponse.json(
          { message: "Sub category not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(sub);
    }

    // LIST
    const subs = await prisma.sub_categories.findMany({
      where: {
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
      include: {
        category: {
          select: { CategoryName: true },
        },
      },
      orderBy: { Sequence: "asc" },
    });

    return NextResponse.json({ data: subs });
  } catch (e) {
    console.error("Sub Categories GET Error:", e);
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
      SubCategoryName,
      CategoryID,
      IsExpense,
      IsIncome,
      Description,
      Sequence,
    } = body;

    if (!SubCategoryName || !CategoryID) {
      return NextResponse.json(
        { message: "Sub category name and category required" },
        { status: 400 },
      );
    }

    const sub = await prisma.sub_categories.create({
      data: {
        SubCategoryName,
        CategoryID,
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
        ActionType: "ADD_SUB_CATEGORY",
        EntityName: "sub_categories",
        EntityID: sub.SubCategoryID,
        NewData: JSON.stringify(sub),
      },
    });

    return NextResponse.json({ message: "Sub category added" });
  } catch (e) {
    console.error("Sub Category POST Error:", e);
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
      SubCategoryID,
      SubCategoryName,
      CategoryID,
      IsExpense,
      IsIncome,
      Description,
      Sequence,
    } = body;

    const existing = await prisma.sub_categories.findFirst({
      where: {
        SubCategoryID,
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Sub category not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.sub_categories.update({
      where: { SubCategoryID },
      data: {
        SubCategoryName,
        CategoryID,
        IsExpense,
        IsIncome,
        Description,
        Sequence,
      },
    });

    await prisma.logs.create({
      data: {
        UserID: session.user.ownerId,
        ActionType: "UPDATE_SUB_CATEGORY",
        EntityName: "sub_categories",
        EntityID: SubCategoryID,
        OldData: JSON.stringify(existing),
        NewData: JSON.stringify(updated),
      },
    });

    return NextResponse.json({ message: "Sub category updated" });
  } catch (e) {
    console.error("Sub Category PATCH Error:", e);
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

    const sub = await prisma.sub_categories.findFirst({
      where: {
        SubCategoryID: id,
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
    });

    if (!sub) {
      return NextResponse.json(
        { message: "Sub category not found" },
        { status: 404 },
      );
    }

    await prisma.sub_categories.update({
      where: { SubCategoryID: id },
      data: { IsDeleted: true },
    });

    await prisma.logs.create({
      data: {
        UserID: session.user.ownerId,
        ActionType: "DELETE_SUB_CATEGORY",
        EntityName: "sub_categories",
        EntityID: id,
        OldData: JSON.stringify(sub),
      },
    });

    return NextResponse.json({ message: "Sub category deleted" });
  } catch (e) {
    console.error("Sub Category DELETE Error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
