"use client";

import Link from "next/link";
import SidebarItem from "@/components/navigation/SidebarItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Tags,
  Layers,
  ListChecks,
  Wallet,
  Banknote,
} from "lucide-react";

export default function AdminSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="h-16 px-4 flex items-center">
        <Link href="/admin/dashboard" className="font-semibold tracking-tight" onClick={onNavigate}>
          Expense Manager
        </Link>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          <SidebarItem href="/admin/dashboard" label="Dashboard" icon={<LayoutDashboard size={18} />} />

          <div className="pt-2">
            <p className="px-3 pb-2 text-xs text-muted-foreground uppercase tracking-wider">
              Finance
            </p>
            <SidebarItem href="/admin/expenses" label="Expenses" icon={<Wallet size={18} />} />
            <SidebarItem href="/admin/incomes" label="Incomes" icon={<Banknote size={18} />} />
          </div>

          <div className="pt-2">
            <p className="px-3 pb-2 text-xs text-muted-foreground uppercase tracking-wider">
              Management
            </p>
            <SidebarItem href="/admin/peoples" label="Peoples" icon={<Users size={18} />} />
            <SidebarItem href="/admin/projects" label="Projects" icon={<FolderKanban size={18} />} />
            <SidebarItem href="/admin/categories" label="Categories" icon={<Tags size={18} />} />
            <SidebarItem href="/admin/sub-categories" label="Sub Categories" icon={<Layers size={18} />} />
          </div>

          <div className="pt-2">
            <p className="px-3 pb-2 text-xs text-muted-foreground uppercase tracking-wider">
              Reports
            </p>
            <SidebarItem href="/admin/logs" label="Logs" icon={<ListChecks size={18} />} />
          </div>
        </div>
      </ScrollArea>

      <Separator />
      <div className="p-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Expense Manager
      </div>
    </div>
  );
}
