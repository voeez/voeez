import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, User, CreditCard } from "lucide-react";
import DashboardLogout from "./DashboardLogout";
import ActiveLink from "./ActiveLink";

const sidebarLinks = [
  { label: "Übersicht", href: "/dashboard",        icon: LayoutDashboard },
  { label: "Konto",     href: "/dashboard/profil", icon: User },
  { label: "Abo",       href: "/dashboard/abo",    icon: CreditCard },
];

interface UserProfile {
  subscription_status: string | null;
  subscription_plan:   string | null;
}

function subscriptionLabel(profile: UserProfile | null): string {
  const status = profile?.subscription_status;
  if (status === "lifetime") return "Lifetime";
  if (status === "active") {
    const plan = profile?.subscription_plan;
    if (plan === "yearly")  return "Pro · Jährlich";
    if (plan === "monthly") return "Pro · Monatlich";
    return "Pro";
  }
  if (status === "trialing") return "Testphase läuft ⏳";
  return "Free Plan";
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let email = "";
  let profile: UserProfile | null = null;

  const supabase = await createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    redirect("/login");
  }
  if (!user) redirect("/login");
  email = user.email ?? "";

  try {
    const { data } = await supabase
      .from("profiles")
      .select("subscription_status, subscription_plan")
      .eq("id", user.id)
      .single();
    profile = data as UserProfile | null;
  } catch {
    // profiles table may not exist yet — gracefully fall back to "Free Plan"
  }

  const planLabel = subscriptionLabel(profile);

  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <aside className="fixed top-16 left-0 z-40 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r border-border/50 bg-surface md:flex">
        {/* User info */}
        <div className="border-b border-border/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{email}</p>
              <p className="text-xs text-muted">{planLabel}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {sidebarLinks.map((link) => (
            <ActiveLink key={link.href} href={link.href} icon={link.icon}>
              {link.label}
            </ActiveLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-border/50 px-3 py-4">
          <DashboardLogout />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-16 right-0 left-0 z-30 flex items-center justify-between border-b border-border/50 bg-surface px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-light hover:text-foreground"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>
        <DashboardLogout mobile />
      </div>

      {/* Main content */}
      <main className="w-full pt-12 md:ml-64 md:pt-0">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
