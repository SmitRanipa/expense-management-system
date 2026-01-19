import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";


export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // ✅ GET SINGLE PEOPLE (EDIT PAGE)
    if (id) {
      const people = await prisma.peoples.findFirst({
        where: {
          PeopleID: Number(id),
          UserID: session.user.ownerId,
          IsDeleted: false,
        },
        select: {
          PeopleID: true,
          PeopleName: true,
          Email: true,
          MobileNo: true,
          IsActive: true,
        },
      });

      if (!people) {
        return NextResponse.json(
          { message: "People not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(people);
    }

    // ✅ GET ALL PEOPLES (LIST PAGE)
    const peoples = await prisma.peoples.findMany({
      where: {
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
      select: {
        PeopleID: true,
        PeopleName: true,
        Email: true,
        MobileNo: true,
        IsActive: true,
      },
      orderBy: {
        Created: "desc",
      },
    });

    return NextResponse.json({ data: peoples });
  } catch (error) {
    console.error("Peoples GET Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, mobile, password } = body;

    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // 🔒 Check duplicate email under same admin
    const existing = await prisma.peoples.findFirst({
      where: {
        Email: email,
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "People with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await hashPassword(password);

    const people = await prisma.peoples.create({
      data: {
        PeopleName: name,
        Email: email,
        MobileNo: mobile,
        Password: hashedPassword,
        UserID: session.user.ownerId,
        IsActive: true,
      },
    });

    // 🧾 LOG
    await prisma.logs.create({
      data: {
        UserID: session.user.ownerId,
        ActionType: "ADD_PEOPLE",
        EntityName: "peoples",
        EntityID: people.PeopleID,
        NewData: JSON.stringify({
          name: people.PeopleName,
          email: people.Email,
        }),
      },
    });

    return NextResponse.json({
      message: "People added successfully",
    });
  } catch (error) {
    console.error("Peoples POST Error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const peopleId = Number(searchParams.get("id"));

    if (!peopleId) {
      return NextResponse.json(
        { message: "People ID required" },
        { status: 400 },
      );
    }

    // 🔍 Ensure ownership
    const people = await prisma.peoples.findFirst({
      where: {
        PeopleID: peopleId,
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
    });

    if (!people) {
      return NextResponse.json(
        { message: "People not found" },
        { status: 404 },
      );
    }

    // 🗑️ Soft delete
    await prisma.peoples.update({
      where: { PeopleID: peopleId },
      data: { IsDeleted: true },
    });

    // 🧾 LOG
    await prisma.logs.create({
      data: {
        UserID: session.user.ownerId,
        ActionType: "DELETE_PEOPLE",
        EntityName: "peoples",
        EntityID: peopleId,
        OldData: JSON.stringify({
          name: people.PeopleName,
          email: people.Email,
        }),
      },
    });

    return NextResponse.json({
      message: "People deleted successfully",
    });
  } catch (error) {
    console.error("Delete People Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { PeopleID, PeopleName, Email, MobileNo } = body;

    const existing = await prisma.peoples.findFirst({
      where: {
        PeopleID,
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "People not found" },
        { status: 404 },
      );
    }

    await prisma.peoples.update({
      where: { PeopleID },
      data: {
        PeopleName,
        Email,
        MobileNo,
      },
    });

    await prisma.logs.create({
      data: {
        UserID: session.user.ownerId,
        ActionType: "UPDATE_PEOPLE",
        EntityName: "peoples",
        EntityID: PeopleID,
        OldData: JSON.stringify({
          name: existing.PeopleName,
          email: existing.Email,
          mobile: existing.MobileNo,
        }),
        NewData: JSON.stringify({
          name: PeopleName,
          email: Email,
          mobile: MobileNo,
        }),
      },
    });

    return NextResponse.json({ message: "People updated" });
  } catch (e) {
    console.error("Edit People Error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { PeopleID } = body;

    const people = await prisma.peoples.findFirst({
      where: {
        PeopleID,
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
    });

    if (!people) {
      return NextResponse.json(
        { message: "People not found" },
        { status: 404 },
      );
    }

    const newStatus = !people.IsActive;

    await prisma.peoples.update({
      where: { PeopleID },
      data: { IsActive: newStatus },
    });

    await prisma.logs.create({
      data: {
        UserID: session.user.ownerId,
        ActionType: "TOGGLE_PEOPLE_STATUS",
        EntityName: "peoples",
        EntityID: PeopleID,
        NewData: JSON.stringify({ IsActive: newStatus }),
      },
    });

    return NextResponse.json({ message: "Status updated" });
  } catch (e) {
    console.error("Toggle Status Error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
