import EmployeeSidebarContent from "./EmployeeSidebarContent";
import AdminSidebarContent from "./AdminSidebarContent";

export default function Sidebar({ variant }: { variant: "employee" | "admin" }) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-card/40 backdrop-blur">
      {variant === "admin" ? <AdminSidebarContent /> : <EmployeeSidebarContent />}
    </aside>
  );
}
