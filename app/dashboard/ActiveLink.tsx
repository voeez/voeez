"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

interface Props {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export default function ActiveLink({ href, icon: Icon, children }: Props) {
  const pathname = usePathname();
  // Exact match for /dashboard, prefix match for sub-pages
  const isActive =
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted hover:bg-surface-light hover:text-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      {children}
    </Link>
  );
}
