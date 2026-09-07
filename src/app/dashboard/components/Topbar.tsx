"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, X } from "lucide-react";
import { SidebarContent } from "./Sidebar";


export function Topbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  // Very simple breadcrumb generation
  const segments = pathname.split("/").filter(Boolean);
  
  return (
    <>
      <header className="h-16 bg-card border-b border-border flex items-center px-4 md:px-8 sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-4 text-sm w-full">
          <button 
            className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-md"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center">
            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;
              const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);
              
              return (
                <div key={segment} className="flex items-center">
                  <span className={isLast ? "font-semibold text-foreground" : "text-muted-foreground"}>
                    {formattedSegment}
                  </span>
                  {!isLast && (
                    <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col shadow-lg animate-in slide-in-from-left-4 duration-300">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground rounded-md z-50 bg-card/50 backdrop-blur"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
