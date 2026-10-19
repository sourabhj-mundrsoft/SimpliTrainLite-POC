"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./icons";

export type NavigationItem = Readonly<{
  href: string;
  label: string;
  icon: IconName;
}>;

export type ShellUser = Readonly<{
  name: string;
  initials: string;
}>;

export type AppShellProps = Readonly<{
  navigation: readonly NavigationItem[];
  user: ShellUser;
  cartCount?: number;
  hasUnreadNotifications?: boolean;
  children: ReactNode;
}>;

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

const iconButtonClassName =
  "relative grid size-10 place-items-center rounded-full text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

function Logo() {
  return (
    <Link
      aria-label="SimpliTrain home"
      className="flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
      href="/"
    >
      <span className="relative block h-14 w-40">
        <svg
          aria-hidden="true"
          className="absolute top-0 left-0 h-11 w-24"
          fill="none"
          viewBox="-2 -3 100 48"
        >
          <defs>
            <linearGradient id="simplitrain-cloud" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#2563eb" />
              <stop offset="1" stopColor="#4ade80" />
            </linearGradient>
          </defs>
          <path
            d="M14 40a12 12 0 0 1-1.5-23.9A20 20 0 0 1 50 8a14 14 0 0 1 24 10"
            stroke="url(#simplitrain-cloud)"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </svg>
        <span className="absolute top-5 left-5 text-xl leading-none font-medium tracking-tight">
          <span className="text-[var(--color-text)]">Simpli</span>
          <span className="text-[var(--color-brand-accent)]">Train</span>
        </span>
        <span className="absolute right-0 bottom-0 text-[0.6rem] font-medium tracking-wide text-[var(--color-text-muted)]">
          TMS + LMS + LXP
        </span>
      </span>
    </Link>
  );
}

export function AppShell({
  navigation,
  user,
  cartCount = 0,
  hasUnreadNotifications = false,
  children,
}: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[var(--color-surface)] focus:px-4 focus:py-2 focus:shadow"
        href="#main-content"
      >
        Skip to content
      </a>
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 pt-3 sm:px-8 lg:flex-nowrap lg:px-12 lg:pt-0">
          <Logo />
          <nav
            aria-label="Main navigation"
            className="order-last -mx-4 flex w-full overflow-x-auto px-4 lg:order-none lg:mx-0 lg:w-auto lg:flex-1 lg:justify-end lg:px-0"
          >
            {navigation.map((item) => {
              const isActive = isActiveRoute(pathname, item.href);
              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={`flex h-12 shrink-0 items-center gap-2 border-b-[3px] px-4 text-[0.95rem] transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-primary)] lg:h-[5.75rem] ${
                    isActive
                      ? "border-[var(--color-primary)] font-semibold text-[var(--color-primary)]"
                      : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="size-[1.1rem]" name={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:ml-0">
            <button
              aria-label="Language: English"
              className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              type="button"
            >
              <Icon name="globe" />
              EN
              <Icon className="size-4" name="chevronDown" />
            </button>
            <button
              aria-label="Contact support"
              className={`${iconButtonClassName} hidden sm:grid`}
              type="button"
            >
              <Icon name="phone" />
            </button>
            <button
              aria-label={
                hasUnreadNotifications
                  ? "Notifications, unread items"
                  : "Notifications"
              }
              className={iconButtonClassName}
              type="button"
            >
              <Icon name="bell" />
              {hasUnreadNotifications ? (
                <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500" />
              ) : null}
            </button>
            <button
              aria-label={`Cart, ${cartCount} items`}
              className={iconButtonClassName}
              type="button"
            >
              <Icon name="cart" />
              {cartCount > 0 ? (
                <span className="absolute -top-0.5 right-0 grid min-w-5 place-items-center rounded-full bg-blue-500 px-1 text-[0.7rem] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </button>
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-[var(--color-on-primary)]"
              >
                {user.initials}
              </span>
              <span className="sr-only xl:not-sr-only xl:text-sm xl:font-semibold xl:whitespace-nowrap xl:text-[var(--color-text)]">
                {user.name}
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="px-4 py-8 sm:px-8 lg:px-12" id="main-content">
        {children}
      </main>
    </div>
  );
}
