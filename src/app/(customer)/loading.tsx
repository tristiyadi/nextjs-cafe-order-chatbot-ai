import { Skeleton } from "@/components/ui/skeleton";
import { Coffee } from "lucide-react";

export default function CustomerLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar Skeleton */}
      <header className="h-20 w-full border-b border-primary/5 flex items-center justify-between px-6 md:px-12 bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/5 shadow-inner" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        <div className="hidden md:flex gap-8">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-11 w-11 rounded-2xl" />
          <Skeleton className="h-11 w-24 rounded-2xl" />
        </div>
      </header>

      <main className="flex-1 container max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Page Content Skeleton - Adapts to Hero or Split View feel */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_500px] gap-12">
          <div className="flex flex-col gap-8">
             {/* Left Content Area (Hero Text or Chat) */}
             <div className="space-y-4">
                <Skeleton className="h-12 w-3/4 rounded-2xl" />
                <Skeleton className="h-12 w-1/2 rounded-2xl" />
             </div>
             <Skeleton className="h-32 w-full rounded-3xl" />
             
             <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
             </div>
             
             <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
             </div>
          </div>

          <div className="hidden md:flex flex-col gap-6">
             {/* Right Content Area (Image or Menu) */}
             <Skeleton className="h-[500px] w-full rounded-[3rem] shadow-xl" />
             <div className="flex justify-between items-center px-4">
                <Skeleton className="h-10 w-32 rounded-full" />
                <div className="flex gap-2">
                   <Skeleton className="h-10 w-10 rounded-full" />
                   <Skeleton className="h-10 w-10 rounded-full" />
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Floating loading indicator */}
      <div className="fixed bottom-10 right-10 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-primary/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center animate-spin">
          <Coffee className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase tracking-widest text-primary">Kafe Nusantara</span>
          <span className="text-[10px] text-muted-foreground animate-pulse leading-none">Menyiapkan hidangan...</span>
        </div>
      </div>
    </div>
  );
}
