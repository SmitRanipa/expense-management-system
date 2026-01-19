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
      const project = await prisma.projects.findFirst({
        where: {
          ProjectID: Number(id),
          UserID: session.user.ownerId,
          IsDeleted: false,
        },
      });

      if (!project) {
        return NextResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(project);
    }

    // LIST
    const projects = await prisma.projects.findMany({
      where: {
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
      orderBy: { Created: "desc" },
    });

    return NextResponse.json({ data: projects });
  } catch (e) {
    console.error("Projects GET Error:", e);
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
      ProjectName,
      ProjectStartDate,
      ProjectEndDate,
      ProjectDetail,
      Description,
    } = body;

    if (!ProjectName) {
      return NextResponse.json(
        { message: "Project name required" },
        { status: 400 }
      );
    }

    const project = await prisma.projects.create({
      data: {
        ProjectName,
        ProjectStartDate,
        ProjectEndDate,
        ProjectDetail,
        Description,
        IsActive: true,
        UserID: session.user.ownerId,
      },
    });

    await prisma.logs.create({
      data: {
        UserID: session.user.ownerId,
        ActionType: "ADD_PROJECT",
        EntityName: "projects",
        EntityID: project.ProjectID,
        NewData: JSON.stringify(project),
      },
    });

    return NextResponse.json({ message: "Project added" });
  } catch (e) {
    console.error("Project POST Error:", e);
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
      ProjectID,
      ProjectName,
      ProjectStartDate,
      ProjectEndDate,
      ProjectDetail,
      Description,
      IsActive,
    } = body;

    const existing = await prisma.projects.findFirst({
      where: {
        ProjectID,
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.projects.update({
      where: { ProjectID },
      data: {
        ProjectName,
        ProjectStartDate,
        ProjectEndDate,
        ProjectDetail,
        Description,
        IsActive,
      },
    });

    await prisma.logs.create({
      data: {
        UserID: session.user.ownerId,
        ActionType: "UPDATE_PROJECT",
        EntityName: "projects",
        EntityID: ProjectID,
        OldData: JSON.stringify(existing),
        NewData: JSON.stringify(updated),
      },
    });

    return NextResponse.json({ message: "Project updated" });
  } catch (e) {
    console.error("Project PATCH Error:", e);
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

    const project = await prisma.projects.findFirst({
      where: {
        ProjectID: id,
        UserID: session.user.ownerId,
        IsDeleted: false,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    await prisma.projects.update({
      where: { ProjectID: id },
      data: { IsDeleted: true },
    });

    await prisma.logs.create({
      data: {
        UserID: session.user.ownerId,
        ActionType: "DELETE_PROJECT",
        EntityName: "projects",
        EntityID: id,
        OldData: JSON.stringify(project),
      },
    });

    return NextResponse.json({ message: "Project deleted" });
  } catch (e) {
    console.error("Project DELETE Error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
