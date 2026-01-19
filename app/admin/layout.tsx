import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/lib/theme";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Header />
      <div style={{ display: "flex", minHeight: "80vh" }}>
        <Sidebar />
        <main style={{ padding: 20, flex: 1 }}>{children}</main>
      </div>
      <Footer />
    </ThemeProvider>
  );
}
