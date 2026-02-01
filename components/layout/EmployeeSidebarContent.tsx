"use client";

import Link from "next/link";
import SidebarItem from "@/components/navigation/SidebarItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, ArrowDownUp, ArrowUpRight, PlusCircle, Wallet, Banknote } from "lucide-react";

export default function EmployeeSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="h-16 px-4 flex items-center">
        <Link href="/employee/dashboard" className="font-semibold tracking-tight" onClick={onNavigate}>
          Expense Manager
        </Link>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          <SidebarItem href="/employee/dashboard" label="Dashboard" icon={<LayoutDashboard size={18} />} />

          <div className="pt-2">
            <p className="px-3 pb-2 text-xs text-muted-foreground uppercase tracking-wider">
              Transactions
            </p>
            <SidebarItem href="/employee/expenses" label="Expenses" icon={<Wallet size={18} />} />
            <SidebarItem href="/employee/incomes" label="Incomes" icon={<Banknote size={18} />} />
          </div>

          <div className="pt-2">
            <p className="px-3 pb-2 text-xs text-muted-foreground uppercase tracking-wider">
              Quick actions
            </p>
            <SidebarItem href="/employee/expenses/add" label="Add Expense" icon={<PlusCircle size={18} />} />
            <SidebarItem href="/employee/incomes/add" label="Add Income" icon={<PlusCircle size={18} />} />
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
