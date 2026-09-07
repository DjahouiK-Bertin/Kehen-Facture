import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background print:h-auto print:overflow-visible print:block">
      <div className="hidden lg:flex print:hidden">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden w-full max-w-full print:overflow-visible print:block">
        <div className="print:hidden"><Topbar /></div>
        <main className="flex-1 overflow-y-auto bg-gray-50 print:overflow-visible print:block print:bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
