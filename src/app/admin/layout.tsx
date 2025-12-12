
'use client';

import { AdminSidebar, AdminMobileHeader } from "@/components/layout/admin-sidebar";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith('/admin/login');

  if (isLoginPage) {
    return (
      <AuthGuard>
        {children}
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-muted/40">
          <AdminSidebar />
          <div className="flex flex-1 flex-col">
            <AdminMobileHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
