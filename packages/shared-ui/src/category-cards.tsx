import { Icon, type IconName } from "./icons";

export type CategoryCard = Readonly<{
  label: string;
  description: string;
  icon: IconName;
  /** Accent color used for the top border and icon tile, e.g. "#4f46e5". */
  accent: string;
  isActive?: boolean;
}>;

export function CategoryCards({
  categories,
  label = "Categories",
}: Readonly<{ categories: readonly CategoryCard[]; label?: string }>) {
  return (
    <ul
      aria-label={label}
      className="grid list-none overflow-hidden rounded-2xl bg-[var(--color-surface)] p-0 shadow-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
    >
      {categories.map((category) => (
        <li
          aria-current={category.isActive ? "true" : undefined}
          className={`border-t-4 border-r border-r-[var(--color-border)] p-5 last:border-r-0 ${
            category.isActive
              ? "bg-[color-mix(in_srgb,var(--color-primary)_6%,var(--color-surface))]"
              : ""
          }`}
          key={category.label}
          style={{ borderTopColor: category.accent }}
        >
          <span
            aria-hidden="true"
            className="grid size-12 place-items-center rounded-xl"
            style={
              category.isActive
                ? { backgroundColor: category.accent, color: "white" }
                : {
                    backgroundColor: `color-mix(in srgb, ${category.accent} 18%, var(--color-surface))`,
                    color: category.accent,
                  }
            }
          >
            <Icon name={category.icon} />
          </span>
          <h2
            className="mt-4 text-lg font-semibold"
            style={category.isActive ? { color: category.accent } : undefined}
          >
            {category.label}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
            {category.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
