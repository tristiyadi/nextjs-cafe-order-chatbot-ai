"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Coffee, RefreshCcw, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/5 p-6 animate-in fade-in duration-500">
      <div className="max-w-md w-full flex flex-col items-center text-center gap-6 p-10 rounded-[2.5rem] bg-white shadow-2xl shadow-primary/5 border border-primary/10">
        <div className="relative">
          <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center animate-pulse">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-500 p-2 rounded-xl shadow-lg border-2 border-white">
            <Coffee className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight">Waduh, Maaf!</h2>
          <p className="text-muted-foreground leading-relaxed">
            Terjadi kendala saat menyiapkan pesanan Anda. Kami sedang berusaha memperbaikinya.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3">
          <Button 
            onClick={() => reset()}
            className="rounded-2xl h-14 text-lg font-bold gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
          >
            <RefreshCcw className="h-5 w-5" /> Coba Lagi
          </Button>
          
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full rounded-2xl h-14 text-lg font-bold border-primary/10">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        <div className="pt-4 text-[10px] text-muted-foreground font-mono opacity-50 uppercase tracking-widest">
          ERROR_CODE: {error.digest || "UNKNOWN_FAILURE"}
        </div>
      </div>
    </div>
  );
}
