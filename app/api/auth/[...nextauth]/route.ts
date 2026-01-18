import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { NextAuthOptions } from "next-auth";

/**
 * NextAuth configuration
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password || !credentials.role) {
          throw new Error("Missing credentials");
        }

        const { email, password, role } = credentials;

        /**
         * ==========================
         * 🔐 ADMIN LOGIN
         * ==========================
         */
        if (role === "ADMIN") {
          const admin = await prisma.users.findFirst({
            where: {
              EmailAddress: email,
              IsDeleted: false,
            },
          });

          if (!admin) {
            throw new Error("Admin not found");
          }

          const isValid = await verifyPassword(password, admin.Password);

          if (!isValid) {
            throw new Error("Invalid password");
          }

          // 🔑 LOGIN LOG
          await prisma.logs.create({
            data: {
              UserID: admin.UserID,
              ActionType: "LOGIN",
              EntityName: "users",
              EntityID: admin.UserID,
            },
          });

          return {
            id: admin.UserID.toString(),
            name: admin.UserName,
            email: admin.EmailAddress,
            role: "ADMIN",
            ownerId: admin.UserID,
          };
        }

        /**
         * ==========================
         * 🔐 EMPLOYEE LOGIN
         * ==========================
         */
        if (role === "EMPLOYEE") {
          const employee = await prisma.peoples.findFirst({
            where: {
              Email: email,
              IsDeleted: false,
              IsActive: true,
            },
          });

          if (!employee) {
            throw new Error("Employee not found");
          }

          // ⚠️ NOTE:
          // peoples.Password is currently plain text
          // we will hash it in a later step
          const isValid = await verifyPassword(password, employee.Password);

          if (!isValid) {
            throw new Error("Invalid password");
          }

          // 🔑 LOGIN LOG (OWNER = ADMIN)
          await prisma.logs.create({
            data: {
              UserID: employee.UserID,
              ActionType: "LOGIN",
              EntityName: "peoples",
              EntityID: employee.PeopleID,
            },
          });

          return {
            id: employee.PeopleID.toString(),
            name: employee.PeopleName,
            email: employee.Email,
            role: "EMPLOYEE",
            ownerId: employee.UserID,
            peopleId: employee.PeopleID,
          };
        }

        throw new Error("Invalid role");
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = (user as any).role;
        token.ownerId = (user as any).ownerId;
        token.peopleId = (user as any).peopleId ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        (session.user as any).role = token.role;
        (session.user as any).ownerId = token.ownerId;
        (session.user as any).peopleId = token.peopleId;
      }
      return session;
    },
  },

  events: {
    async signOut({ token }) {
      if (token?.userId) {
        await prisma.logs.create({
          data: {
            UserID: Number(token.userId),
            ActionType: "LOGOUT",
            EntityName: "users",
            EntityID: Number(token.userId),
          },
        });
      }
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
