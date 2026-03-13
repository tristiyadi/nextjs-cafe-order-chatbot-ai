import { Loader2, Coffee } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md transition-all duration-500">
      <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-white/50 shadow-2xl border border-primary/10 animate-in fade-in zoom-in duration-300">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary animate-spin" style={{ width: '80px', height: '80px', margin: '-10px' }}></div>
          
          {/* Inner pulsing coffee icon */}
          <div className="bg-primary/10 p-5 rounded-full shadow-inner animate-pulse">
            <Coffee className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-black tracking-tight text-foreground">
            Kafe <span className="text-primary italic font-serif">Nusantara</span>
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <p className="animate-pulse">Menyiapkan pengalaman terbaik...</p>
          </div>
        </div>

        {/* Skeleton structure mimics below */}
        <div className="w-48 space-y-3 pt-4 opacity-50">
          <div className="h-2 w-full bg-primary/10 rounded-full animate-pulse" />
          <div className="h-2 w-5/6 bg-primary/10 rounded-full animate-pulse mx-auto" />
          <div className="h-2 w-4/6 bg-primary/10 rounded-full animate-pulse mx-auto" />
        </div>
        
        {/* Subtle decorative dots */}
        <div className="flex gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-primary/20 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
