"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function UserProfile() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser({
            email: user.email || "",
            name: user.user_metadata?.full_name || "Utilisateur",
          });
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [supabase]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 m-4 mt-0 border border-border rounded-xl bg-secondary/30 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary animate-pulse shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-secondary animate-pulse rounded w-3/4"></div>
          <div className="h-3 bg-secondary animate-pulse rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Fallback if no user is found
  }

  // Generate avatar URL from name
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

  return (
    <div className="p-4 m-4 mt-0 border border-border rounded-xl bg-secondary/30 flex items-center gap-3 group relative hover:bg-secondary/50 transition-colors">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-semibold truncate">{user.name}</p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
      
      <button 
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="text-muted-foreground shrink-0 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-500/10"
        title="Se déconnecter"
      >
        {isLoggingOut ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
