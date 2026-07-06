"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { UserSwitcher } from "@/components/user-switcher";
import { useTranslations } from "@/lib/i18n/context";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { t } = useTranslations();

  const navLinkClass = (href: string) =>
    [
      "rounded px-3 py-2 text-sm font-medium transition-colors",
      pathname === href
        ? "bg-gray-900 text-white"
        : "text-gray-700 hover:bg-gray-100",
    ].join(" ");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Link href="/forum" className="text-lg font-semibold">
              Community Forum
            </Link>
            <nav className="ml-4 flex gap-1">
              <Link href="/forum" className={navLinkClass("/forum")}>
                {t("nav.forum")}
              </Link>
              <Link href="/saved" className={navLinkClass("/saved")}>
                {t("nav.saved")}
              </Link>
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <UserSwitcher />
            <LocaleSwitcher />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
