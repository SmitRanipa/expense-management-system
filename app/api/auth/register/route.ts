import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userName, email, password, mobileNo } = body;

    // 1️⃣ Basic validation
    if (!userName || !email || !password || !mobileNo) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        EmailAddress: email,
        IsDeleted: false,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // 3️⃣ Hash password
    const hashedPassword = await hashPassword(password);

    // 4️⃣ Create user
    const user = await prisma.users.create({
      data: {
        UserName: userName,
        EmailAddress: email,
        Password: hashedPassword,
        MobileNo: mobileNo,
      },
    });

    // 5️⃣ Log REGISTER
    await prisma.logs.create({
      data: {
        UserID: user.UserID,
        ActionType: "REGISTER",
        EntityName: "users",
        EntityID: user.UserID,
        NewData: JSON.stringify({
          email: user.EmailAddress,
          userName: user.UserName,
        }),
      },
    });

    // 6️⃣ Success response
    return NextResponse.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register Error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
