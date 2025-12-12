'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { isAdminEmail } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    // 1. Don't run logic while Firebase is still loading user state
    if (loading) return;

    // 2. Define what an "Admin Page" is
    const isAdminPage = pathname.startsWith('/admin');
    const isLoginPage = pathname.startsWith('/admin/login');

    if (isAdminPage && !isLoginPage) {
      // 3. Check Authentication & Authorization
      if (!user) {
        // Not logged in -> Redirect to Login
        router.replace('/admin/login');
      } else if (!isAdminEmail(user.email)) {
        // Logged in but not an admin -> Redirect to Login (or could be 403)
        // Ideally show a "Not Authorized" toast or page, but redirection is safest for now
        router.replace('/admin/login');
      }
    } else if (isLoginPage && user && isAdminEmail(user.email)) {
      // 4. If already logged in as admin, redirect away from login page
      router.replace('/admin');
    }

  }, [user, loading, pathname, router]);

  // Show loading spinner while Firebase initializes or while checking permissions
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // If we are on a protected page and not authorized (and haven't redirected yet),
  // we effectively render nothing until the redirect happens.
  // This prevents "flash of content".
  const isAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  if (isAdminPage && (!user || !isAdminEmail(user.email))) {
    return null;
  }

  return <>{children}</>;
}
