import { Button } from "@/components/ui/button";
import { Coffee, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/5 p-6 animate-in fade-in duration-500">
      <div className="max-w-md w-full flex flex-col items-center text-center gap-8 p-12 rounded-[3rem] bg-white shadow-2xl shadow-primary/5 border border-primary/10">
        <div className="relative">
          <div className="h-32 w-32 bg-primary/5 rounded-full flex items-center justify-center">
             <Search className="h-16 w-16 text-primary/20 absolute animate-pulse" />
             <Coffee className="h-14 w-14 text-primary relative translate-y-2 opacity-10" />
             <span className="text-6xl font-black text-primary/10 absolute -top-4 -right-4 italic">404</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tighter">Menu Tidak Ada!</h2>
          <p className="text-muted-foreground leading-relaxed text-balance px-4 text-sm font-medium">
            Sepertinya halaman yang Anda cari tidak ada di daftar menu kami. Mari kembali ke bar utama.
          </p>
        </div>

        <Link href="/" className="w-full">
          <Button 
            className="w-full rounded-2xl h-16 text-lg font-bold gap-3 shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all group"
          >
            <Home className="h-6 w-6 group-hover:scale-110 transition-transform" /> Kembali ke Utama
          </Button>
        </Link>

        <div className="flex items-center gap-2 opacity-20">
          <div className="h-1 w-1 bg-primary rounded-full"></div>
          <div className="h-1 w-1 bg-primary rounded-full"></div>
          <div className="h-1 w-1 bg-primary rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
