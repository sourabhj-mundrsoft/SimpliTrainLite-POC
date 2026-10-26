"use client";

import type { ReactNode } from "react";

export type SectionCardProps = {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SectionCard({ id, title, description, action, children }: SectionCardProps) {
  return (
    <section
      id={id}
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs transition-shadow"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  disabled?: boolean;
  type?: "text" | "email" | "url" | "password";
};

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  hint,
  disabled,
  type = "text",
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[var(--color-text)]" htmlFor={id}>
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary)] disabled:opacity-60"
      />
      {hint ? <p className="text-xs text-[var(--color-text-muted)]">{hint}</p> : null}
    </div>
  );
}

export type NumberFieldProps = {
  id: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  hint?: string;
};

export function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  required,
  hint,
}: NumberFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[var(--color-text)]" htmlFor={id}>
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </label>
      <input
        id={id}
        type="number"
        value={Number.isNaN(value) ? "" : value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] focus-visible:border-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary)]"
      />
      {hint ? <p className="text-xs text-[var(--color-text-muted)]">{hint}</p> : null}
    </div>
  );
}

export type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  options: readonly { label: string; value: string }[];
  onChange: (val: string) => void;
  required?: boolean;
  hint?: string;
};

export function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  required,
  hint,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[var(--color-text)]" htmlFor={id}>
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] focus-visible:border-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary)]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint ? <p className="text-xs text-[var(--color-text-muted)]">{hint}</p> : null}
    </div>
  );
}

export type TextAreaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
};

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  hint,
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[var(--color-text)]" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary)]"
      />
      {hint ? <p className="text-xs text-[var(--color-text-muted)]">{hint}</p> : null}
    </div>
  );
}

export type SwitchFieldProps = {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function SwitchField({ id, label, description, checked, onChange }: SwitchFieldProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text)] cursor-pointer">
          {label}
        </label>
        {description ? (
          <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
          checked ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
