"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  ArrowRightLeft, 
  Wallet, 
  FileText, 
  PieChart, 
  BarChart2,
  HelpCircle,
  Settings,
  Moon,
  Search,
  Users
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { UserProfile } from "./UserProfile";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: ArrowRightLeft, label: "Transactions", href: "/dashboard/transactions" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
  { icon: FileText, label: "Invoice", href: "/dashboard/invoices" },
  { icon: Users, label: "Clients", href: "/dashboard/clients" },
  { icon: PieChart, label: "Budgeting", href: "/dashboard/budgeting" },
  { icon: BarChart2, label: "Reports", href: "/dashboard/reports" },
];

export function SidebarContent() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredMenuItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="p-6">
        <Logo />
      </div>
      
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Rechercher..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-2 bg-secondary/50 border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="text-[10px] font-sans px-1.5 py-0.5 bg-background rounded border text-muted-foreground">⌘</kbd>
            <kbd className="text-[10px] font-sans px-1.5 py-0.5 bg-background rounded border text-muted-foreground">F</kbd>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Menu
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {filteredMenuItems.length > 0 ? (
          filteredMenuItems.map((item) => {
            const isActive = pathname.includes(item.href) && 
              (item.href === "/dashboard" ? pathname === "/dashboard" : true);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </Link>
            );
          })
        ) : (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">
            Aucun menu trouvé
          </div>
        )}
      </nav>

      <div className="p-4 space-y-1 border-t border-border mt-auto">
        <Link
          href="/dashboard/help"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
          Help and Support
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
          Settings
        </Link>
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-foreground">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-muted-foreground" />
            Dark Mode
          </div>
          {/* Toggle Switch Placeholder */}
          <div className="w-8 h-4 bg-muted rounded-full relative cursor-pointer">
            <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      <UserProfile />
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0 shrink-0">
      <SidebarContent />
    </aside>
  );
}
