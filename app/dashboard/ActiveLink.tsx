"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
interface Props {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function ActiveLink({ href, icon, children }: Props) {
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
      {icon}
      {children}
    </Link>
  );
}
