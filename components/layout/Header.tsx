"use client";

import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";

type HeaderProps = {
  title: string;
  onOpenSidebar?: () => void;
  panelLabel?: string;
};


export default function Header({ title, onOpenSidebar , panelLabel}: HeaderProps) {
  const { data } = useSession();
  const name = data?.user?.name ?? "Employee";
  const email = data?.user?.email ?? "";
  

  return (
    <header className="h-16 flex items-center justify-between border-b bg-background/70 backdrop-blur px-4 md:px-6">
      <div className="flex items-center gap-3">
        {onOpenSidebar ? (
          <Button variant="outline" size="icon" className="md:hidden" onClick={onOpenSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        ) : null}

        <div>
          <h1 className="text-lg font-semibold leading-tight">{title}</h1>
          <p className="text-xs text-muted-foreground">{panelLabel ?? "Panel"}</p>

        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback>{name?.slice(0, 1)?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm">{name}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="space-y-1">
              <div className="text-sm font-medium">{name}</div>
              {email ? <div className="text-xs text-muted-foreground">{email}</div> : null}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2" disabled>
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-red-600 focus:text-red-600"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
