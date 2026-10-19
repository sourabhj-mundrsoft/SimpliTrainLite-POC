import { Icon, type IconName } from "./icons";

export type SidebarGroup = Readonly<{
  title: string;
  items: readonly Readonly<{
    label: string;
    icon: IconName;
    isActive?: boolean;
  }>[];
}>;

export function SectionSidebar({
  groups,
  label = "Section navigation",
}: Readonly<{ groups: readonly SidebarGroup[]; label?: string }>) {
  return (
    <nav
      aria-label={label}
      className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] py-5 lg:border-r lg:border-b-0"
    >
      {groups.map((group) => (
        <div className="mb-5 last:mb-0" key={group.title}>
          <p className="px-5 text-xs font-bold tracking-wider text-[var(--color-text-muted)] uppercase">
            {group.title}
          </p>
          <ul className="mt-2 list-none p-0">
            {group.items.map((item) => (
              <li
                aria-current={item.isActive ? "page" : undefined}
                className={`flex items-center gap-3 border-l-[3px] px-5 py-3 text-[0.95rem] ${
                  item.isActive
                    ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface))] font-semibold text-[var(--color-primary)]"
                    : "border-transparent text-[var(--color-text-muted)]"
                }`}
                key={item.label}
              >
                <Icon className="size-[1.1rem]" name={item.icon} />
                <span className="flex-1">{item.label}</span>
                <Icon
                  className="size-4 text-[var(--color-text-subtle)]"
                  name="star"
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
