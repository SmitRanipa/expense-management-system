"use client";

import * as React from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type LoginRole = "ADMIN" | "EMPLOYEE";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [role, setRole] = React.useState<LoginRole>("ADMIN");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (status !== "authenticated") return;

    const role = session?.user?.role;
    if (role === "ADMIN") router.replace("/admin/dashboard");
    else if (role === "EMPLOYEE") router.replace("/employee/dashboard");
  }, [status, session, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      role,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials or role");
      return;
    }

    const target =
      role === "ADMIN" ? "/admin/dashboard" : "/employee/dashboard";
    router.replace(target);
  }

  return (
    <Card className="border-muted/50 bg-background/70 shadow-xl backdrop-blur">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <p className="text-sm text-muted-foreground">
          Sign in to manage expenses & incomes.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Role Tabs */}
        <div className="space-y-2">
          <Label>Login as</Label>
          <Tabs value={role} onValueChange={(v) => setRole(v as LoginRole)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ADMIN">Admin</TabsTrigger>
              <TabsTrigger value="EMPLOYEE">Employee</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Create one
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
