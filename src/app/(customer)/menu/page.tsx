/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Navbar } from "@/components/layout/navbar";
import { MenuDisplay } from "@/components/order/menu-display";
import { Badge } from "@/components/ui/badge";
import { Coffee } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MenuPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session) {
      const role = (session.user as any).role;
      if (role === "admin") router.push("/admin/menu");
      if (role === "kitchen") router.push("/kitchen");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-black uppercase tracking-widest text-xs opacity-50">Menyiapkan Menu...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">
        <div className="flex flex-col gap-10 md:gap-16 transition-all duration-700">
          <div className="flex flex-col gap-6 max-w-4xl">
             <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 bg-primary/5 text-primary border-primary/20">
                   Eksplorasi Rasa
                </Badge>
             </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-3">
                   <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-tight">
                    Menu <span className="text-primary italic font-serif">Nusantara</span>
                   </h1>
                   <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl">
                      Temukan keajaiban cita rasa kopi dan hidangan otentik dari seluruh penjuru Indonesia. 
                      Semua disajikan dengan kualitas terbaik untuk menemani momen berharga Anda.
                   </p>
                </div>
              </div>
          </div>

          <MenuDisplay />
        </div>
      </main>

      <footer className="border-t py-16 bg-background mt-20">
        <div className="container max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
            <Coffee className="h-8 w-8 text-primary" />
            <span>AI CAFE ORDER</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Tentang Kami</Link>
            <Link href="#" className="hover:text-primary transition-colors">Lokasi</Link>
            <Link href="#" className="hover:text-primary transition-colors">Kontak</Link>
            <Link href="#" className="hover:text-primary transition-colors">Bantuan</Link>
          </div>
          <p className="text-sm font-medium text-muted-foreground">© 2026 AI CAFE ORDER CHATBOT. Kafe Nusantara Group.</p>
        </div>
      </footer>
    </div>
  );
}
