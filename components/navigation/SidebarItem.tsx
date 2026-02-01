"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

export default function SidebarItem({ href, label, icon }: SidebarItemProps) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/employee/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
        "hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground font-medium"
      )}
    >
      {icon ? <span className="text-base">{icon}</span> : null}
      <span>{label}</span>
    </Link>
  );
}
