"use client";

import type { IntegrationItem } from "../types";
import { SectionCard } from "./ui-fields";

export type IntegrationsTabProps = {
  integrations: IntegrationItem[];
};

export function IntegrationsTab({ integrations }: IntegrationsTabProps) {
  return (
    <SectionCard
      title="Third-Party Integrations"
      description="Connect identity providers, virtual meeting services, and payment processors."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-[var(--color-text)]">{item.name}</h4>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    item.status === "connected"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.status === "connected" ? "Connected" : "Disconnected"}
                </span>
              </div>
              <p className="mt-2 text-xs text-[var(--color-text-muted)] leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-end">
              <button
                type="button"
                className="rounded-lg border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] transition"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
