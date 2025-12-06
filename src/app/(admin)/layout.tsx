
'use client';

import React from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarOverlay } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Home } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
        <AdminSidebar />
        <SidebarOverlay />
        <div className="flex flex-col md:pl-[256px]">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <SidebarTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SidebarTrigger>
            <div className="w-full flex-1">
              {/* Optional: Add search or other header items here */}
            </div>
            <Link href="/" passHref>
              <Button variant="outline" size="icon" aria-label="Go to Storefront">
                  <Home className="h-5 w-5" />
              </Button>
            </Link>
          </header>
          <main className="flex-1 bg-muted/40">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
