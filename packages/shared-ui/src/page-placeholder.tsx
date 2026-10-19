export function PagePlaceholder({
  title,
  description,
}: Readonly<{ title: string; description: string }>) {
  return (
    <section className="rounded-2xl bg-[var(--color-surface)] p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">
        {title}
      </h1>
      <p className="mt-2 text-lg text-[var(--color-text-muted)]">
        {description}
      </p>
    </section>
  );
}
