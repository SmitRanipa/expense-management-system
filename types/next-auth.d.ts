// import NextAuth from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//     };
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     userId?: string;
//   }
// }



import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "EMPLOYEE";
      ownerId: number;
      peopleId?: number | null;
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: "ADMIN" | "EMPLOYEE";
    ownerId?: number;
    peopleId?: number | null;
  }
}
