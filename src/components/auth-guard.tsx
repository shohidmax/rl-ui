'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [init, setInit] = useState(true);

  useEffect(() => {
    // Wait for hydration (user loading from localstorage)
    // In our simple AuthProvider, user is loaded in useEffect, so we might have a small race/flicker.
    // Ideally AuthProvider should expose 'loading' state.
    // For now, we assume if user is null, we are not logged in.
    // We'll use a small timeout or just check immediately since provider runs first.
    setInit(false);
  }, []);

  useEffect(() => {
    if (init) return;

    const isAdminPage = pathname.startsWith('/admin');
    const isLoginPage = pathname.startsWith('/admin/login');

    if (isLoginPage) {
      if (isAuthenticated && isAdmin) {
        router.replace('/admin');
      }
      return;
    }

    if (isAdminPage) {
      if (!isAuthenticated) {
        router.replace('/admin/login');
      } else if (!isAdmin) {
        // Logged in but not admin
        router.replace('/');
      }
    }
  }, [user, isAuthenticated, isAdmin, pathname, router, init]);


  if (init) {
    return null; // Or spinner
  }

  // If we are on admin page and invalid, don't show content (handled by router.replace but prevent flash)
  const isAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  if (isAdminPage && (!isAuthenticated || !isAdmin)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
