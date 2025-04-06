import { useState, useEffect, ReactNode } from "react";
import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevents SSR hydration issues
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="h-16 border-b border-neutral-200 px-4 flex items-center">
          <Skeleton className="h-8 w-40" />
          <div className="flex-1" />
          <Skeleton className="h-10 w-10 rounded-full ml-4" />
        </div>
        <div className="flex flex-1">
          <div className="w-64 border-r border-neutral-200 hidden lg:block">
            <div className="p-4">
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
            <div className="px-2 py-4 space-y-1">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          </div>
          <main className="flex-1 p-6 overflow-auto">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
            
            <Skeleton className="h-80 w-full rounded-lg" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
