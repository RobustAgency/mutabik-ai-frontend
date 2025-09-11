import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/layouts/AppShell";
import ToastProvider from "@/providers/ToastProvider";

export const runtime = 'edge';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let user = null;
  let initialProfile: { id: string; full_name?: string | null; avatar_url?: string | null } | null = null;
  
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error } = await supabase.auth.getUser();
    
    if (!error && authUser) {
      user = authUser;
      
      try {
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .eq("id", authUser.id)
          .single();
        initialProfile = (data as typeof initialProfile) ?? null;
      } catch (profileError) {
        console.warn('Failed to fetch user profile:', profileError);
      }
    }
  } catch (error) {
    console.error('Failed to initialize auth:', error);
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthProvider initialUser={user} initialProfile={initialProfile}>
          <AppShell>{children}</AppShell>
        </AuthProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
