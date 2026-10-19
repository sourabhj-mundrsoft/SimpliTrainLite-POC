import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AppShell, type NavigationItem } from "./index";

const pathname = vi.hoisted(() => ({ current: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.current,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const navigation: NavigationItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/admin", label: "Admin", icon: "admin" },
  { href: "/reports", label: "Reports", icon: "reports" },
];

function renderShell(currentPath: string) {
  pathname.current = currentPath;
  return render(
    <AppShell
      cartCount={3}
      hasUnreadNotifications
      navigation={navigation}
      user={{ name: "Demo Admin", initials: "DA" }}
    >
      <p>Page content</p>
    </AppShell>,
  );
}

describe("AppShell", () => {
  it("renders exactly the navigation items the app passes in", () => {
    renderShell("/");

    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Home",
      "Admin",
      "Reports",
    ]);
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("marks only the current route as active", () => {
    renderShell("/admin/users");

    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).getByRole("link", { name: "Admin" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("shows the header utilities and signed-in user", () => {
    renderShell("/");

    expect(
      screen.getByRole("button", { name: "Language: English" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Notifications, unread items" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cart, 3 items" }),
    ).toHaveTextContent("3");
    expect(screen.getByText("Demo Admin")).toBeInTheDocument();
  });
});
