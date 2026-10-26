import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SettingsPanel } from "./settings-panel";

describe("SettingsPanel", () => {
  it("renders Settings header and tabs", () => {
    render(<SettingsPanel />);

    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Center \/ Organization/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Branding/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /System/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Roles & Permissions/i })).toBeInTheDocument();
  });

  it("switches tabs when clicked", () => {
    render(<SettingsPanel />);

    // Click Branding tab
    fireEvent.click(screen.getByRole("button", { name: /Branding/i }));
    expect(screen.getByText("Theme & Brand Appearance")).toBeInTheDocument();

    // Click System tab
    fireEvent.click(screen.getByRole("button", { name: /System/i }));
    expect(screen.getByText("Platform Status & Maintenance")).toBeInTheDocument();

    // Click Roles tab
    fireEvent.click(screen.getByRole("button", { name: /Roles & Permissions/i }));
    expect(screen.getByText("User Roles & Access Permissions")).toBeInTheDocument();
  });

  it("updates field values, marks dirty, and triggers onSave callback", async () => {
    const onSave = vi.fn();
    render(<SettingsPanel onSave={onSave} />);

    const nameInput = screen.getByLabelText(/Center Name/i);
    expect(nameInput).toHaveValue("Acme Training Center");

    // Change Center Name
    fireEvent.change(nameInput, { target: { value: "New Acme Academy" } });
    expect(nameInput).toHaveValue("New Acme Academy");

    // Unsaved changes badge should appear
    expect(screen.getByText("Unsaved changes")).toBeInTheDocument();

    // Save Settings button should now be enabled
    const saveButton = screen.getByRole("button", { name: /Save Settings/i });
    expect(saveButton).not.toBeDisabled();

    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        organization: expect.objectContaining({
          name: "New Acme Academy",
        }),
      })
    );
  });
});
