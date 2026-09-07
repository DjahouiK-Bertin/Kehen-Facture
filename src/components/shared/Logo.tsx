import Link from "next/link";
import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

export function Logo({ className, collapsed = false }: LogoProps) {
  return (
    <Link
      href="/dashboard"
      className={cn("flex items-center gap-2 font-bold text-xl", className)}
    >
      <div className="bg-primary text-primary-foreground p-1.5 rounded-lg" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        <Receipt className="w-5 h-5" />
      </div>
      {!collapsed && <span className="tracking-tight">KEHENFacture</span>}
    </Link>
  );
}
