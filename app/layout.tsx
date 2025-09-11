import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/layouts/AppShell";
import ToastProvider from "@/providers/ToastProvider";

export const runtime = 'edge';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let initialProfile: { id: string; full_name?: string | null; avatar_url?: string | null } | null = null;
  if (user?.id) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", user.id)
      .single();
    initialProfile = (data as typeof initialProfile) ?? null;
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
