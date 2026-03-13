/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { Coffee, AlertCircle, Bell, History, LayoutDashboard, Edit3, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";

interface OrderItem {
  quantity: number;
  notes?: string;
  menuItem?: {
    name: string;
  } | null;
}

interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  totalAmount: string;
  status: "pending" | "accepted" | "preparing" | "ready" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "accepted", label: "Diterima", color: "bg-sky-100 text-sky-700 border-sky-200" },
  { value: "preparing", label: "Proses", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "ready", label: "Siap", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "completed", label: "Selesai", color: "bg-gray-100 text-gray-600 border-gray-200" },
  { value: "cancelled", label: "Dibatalkan", color: "bg-red-100 text-red-700 border-red-200" },
];

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const { data: session, isPending } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fetchOrders = async () => {
    try {
      // Fetch all orders for management
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.results || []);
      }
    } catch (err) {
      console.error("Kitchen Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error("Status Update Error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // 10s poll
    return () => clearInterval(interval);
  }, [session, isPending]);

  const activeOrders = useMemo(() => 
    orders
      .filter(o => o.status !== "completed" && o.status !== "cancelled")
      .sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  , [orders]);

  const historyOrders = useMemo(() => 
    orders
      .filter(o => o.status === "completed" || o.status === "cancelled")
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  , [orders]);

  const pendingCount = useMemo(() => orders.filter(o => o.status === "pending").length, [orders]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Kitchen Navbar */}
      <header className="h-20 min-h-[5rem] border-b border-border bg-background/60 backdrop-blur-xl sticky top-0 z-50 px-6 md:px-12 flex items-center justify-between transition-all">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-amber-500">
               <Coffee className="h-8 w-8" />
               <span>KITCHEN<span className="text-foreground">OS</span></span>
            </div>
            <Separator orientation="vertical" className="h-8 bg-border" />
            <div className="flex flex-col">
               <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold opacity-70">Antrean Aktif</span>
               <span className="text-xl font-mono font-black">{activeOrders.length}</span>
            </div>
         </div>
         
         <div className="flex items-center gap-4">
            {(session?.user as any)?.role === "admin" && (
               <Button 
                 onClick={() => window.location.href = '/admin/menu'}
                 variant="outline" 
                 className="hidden md:flex items-center gap-2 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest px-6 h-11"
               >
                 <Edit3 className="h-4 w-4" />
                 Kelola Menu
               </Button>
            )}
             <div className="relative">
                <Button variant="outline" size="icon" className="rounded-2xl border-border bg-accent/10 hover:bg-accent/20 h-11 w-11 shadow-sm">
                   <Bell className="h-5 w-5" />
                </Button>
                {pendingCount > 0 && (
                   <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-black animate-bounce shadow-lg shadow-red-500/20 text-white">
                      {pendingCount}
                   </div>
                )}
             </div>

             {mounted && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-2xl border-border bg-accent/10 hover:bg-accent/20 h-11 w-11 shadow-sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
             )}

             <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="text-right flex flex-col hidden sm:flex">
                   <span className="text-xs font-black tracking-tight">{session?.user.name || "Chef Mode"}</span>
                   <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest leading-none">Kitchen Staff</span>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-amber-500 flex items-center justify-center font-black text-black border-2 border-amber-400 shadow-lg group">
                   {session?.user.name?.charAt(0) || "C"}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-11 w-11 rounded-2xl border-border bg-accent/10 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all ml-1 shadow-sm"
                  onClick={() => { authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/login"; } } }) }}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
             </div>
         </div>
      </header>
      
      <main className="flex-1 container max-w-[1700px] mx-auto px-6 md:px-12 py-8 md:py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <TabsList className="bg-accent/10 border border-border p-1 rounded-2xl h-14">
                 <TabsTrigger value="active" className="rounded-xl px-8 h-12 gap-2 text-sm font-bold data-[state=active]:bg-amber-500 data-[state=active]:text-black transition-all">
                    <LayoutDashboard className="h-4 w-4" /> Pesanan Aktif
                 </TabsTrigger>
                 <TabsTrigger value="history" className="rounded-xl px-8 h-12 gap-2 text-sm font-bold data-[state=active]:bg-amber-500 data-[state=active]:text-black transition-all">
                    <History className="h-4 w-4" /> Riwayat Selesai
                 </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-3 px-6 py-3 bg-accent/5 border border-border rounded-2xl shadow-sm">
                 <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-xs font-bold uppercase tracking-widest opacity-50">Sinkronisasi Realtime Aktif</span>
              </div>
           </div>

           <TabsContent value="active" className="mt-0 outline-none w-full">
             <OrderGrid orders={activeOrders} loading={loading} updateStatus={updateStatus} />
           </TabsContent>

           <TabsContent value="history" className="mt-0 outline-none w-full">
             <OrderGrid orders={historyOrders} loading={loading} updateStatus={updateStatus} isHistory />
           </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function OrderGrid({ orders, loading, updateStatus, isHistory = false }: { orders: Order[], loading: boolean, updateStatus: (id: string, s: string) => void, isHistory?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-6 md:gap-8">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="bg-card border-border h-[450px] animate-pulse rounded-[2.5rem]" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-6 opacity-30">
         <Coffee className="h-32 w-32" />
         <p className="text-2xl md:text-3xl font-serif italic text-center max-w-md">
           {isHistory ? "Belum ada riwayat pesanan." : "Belum ada pesanan masuk. Santai sejenak sepertinya enak."}
         </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-6 md:gap-8 auto-rows-max overflow-hidden">
      {orders.map((order) => (
        <Card key={order.id} className={cn(
          "rounded-[2.5rem] bg-card border-border shadow-xl flex flex-col group overflow-hidden transition-all duration-300 ring-2",
          order.status === "pending" ? "ring-amber-500/50" : "ring-transparent",
          isHistory && "opacity-80 scale-95 hover:opacity-100 hover:scale-100"
        )}>
          <CardHeader className="p-6 pb-4 border-b border-border bg-accent/5">
             <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase">TABLE</span>
                   <span className="text-4xl font-mono font-black border-l-4 border-amber-500 pl-3 leading-none">{order.tableNumber}</span>
                </div>
                <Badge className={cn(
                  "rounded-full px-5 py-1.5 font-black text-[10px] tracking-widest border-none shadow-lg",
                  statusOptions.find(s => s.value === order.status)?.color
                )}>
                  {statusOptions.find(s => s.value === order.status)?.label.toUpperCase()}
                </Badge>
             </div>
             <div className="flex flex-col gap-0.5 mt-5">
                <p className="text-xs text-muted-foreground font-mono flex justify-between">
                   <span>ID: #{order.id.slice(-6).toUpperCase()}</span>
                   <span>{new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </p>
                <p className="text-sm font-bold text-foreground/90 truncate">{order.customerName}</p>
             </div>
          </CardHeader>
          
          <CardContent className="p-6 flex-1 flex flex-col gap-6 scrollbar-hide overflow-y-auto max-h-[300px]">
             <div className="flex flex-col gap-3">
                {order.items.map((item, idx) => (
                   <div key={idx} className="flex gap-4 items-start bg-accent/5 p-4 rounded-3xl border border-border shadow-inner group/item hover:bg-accent/10 transition-colors">
                      <div className="h-9 w-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                         {item.quantity}x
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold text-sm leading-tight text-foreground/95">{item.menuItem?.name}</span>
                         {item.notes && <span className="text-[10px] text-amber-500/80 font-black italic mt-1 leading-tight">{item.notes}</span>}
                      </div>
                   </div>
                ))}
             </div>
             
             {order.notes && (
               <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-3xl flex gap-3 items-start animate-pulse">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/90 leading-relaxed font-bold">CATATAN: {order.notes}</p>
               </div>
             )}
          </CardContent>
                    <CardFooter className="p-4 grid grid-cols-1 gap-2 bg-accent/5 mt-auto border-t border-border">
             {!isHistory ? (
               <>
                 {order.status === "pending" && (
                   <Button className="bg-amber-500 hover:bg-amber-600 text-black font-black rounded-2xl h-14 shadow-xl shadow-amber-500/20 active:scale-95 transition-all" onClick={() => updateStatus(order.id, "accepted")}>
                      TERIMA PESANAN
                   </Button>
                 )}
                 {order.status === "accepted" && (
                   <Button className="bg-blue-500 hover:bg-blue-600 text-black font-black rounded-2xl h-14 shadow-xl shadow-blue-500/20 active:scale-95 transition-all" onClick={() => updateStatus(order.id, "preparing")}>
                      MULAI PROSES
                   </Button>
                 )}
                 {order.status === "preparing" && (
                   <Button className="bg-green-500 hover:bg-green-600 text-black font-black rounded-2xl h-14 shadow-xl shadow-green-500/20 active:scale-95 transition-all" onClick={() => updateStatus(order.id, "ready")}>
                      SIAP DIAMBIL
                   </Button>
                 )}
                 {order.status === "ready" && (
                   <Button className="bg-zinc-100 hover:bg-white text-black font-black rounded-2xl h-14 shadow-xl shadow-white/10 active:scale-95 transition-all uppercase tracking-widest" onClick={() => updateStatus(order.id, "completed")}>
                      Selesaikan Order
                   </Button>
                 )}
                 <Button variant="ghost" className="text-white/20 hover:text-red-400 text-[10px] font-black uppercase tracking-widest mt-1" onClick={() => updateStatus(order.id, "cancelled")}>
                    Batalkan Pesanan
                 </Button>
               </>
              ) : (
                 <div className="py-2 text-center text-[10px] font-black uppercase tracking-widest opacity-30 border border-border rounded-2xl">
                    Tersimpan di Arsip
                 </div>
              )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
