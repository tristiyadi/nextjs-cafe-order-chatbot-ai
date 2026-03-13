/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if ((session?.user as any)?.role === "admin") {
        // Default admin landing is the kitchen monitor per request
        router.push("/kitchen");
      } else {
        router.push("/");
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-950 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-black uppercase tracking-widest text-xs opacity-50">Mengalihkan ke Dashboard...</p>
      </div>
    </div>
  );
}
