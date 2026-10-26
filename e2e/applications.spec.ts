import { expect, test, type Page } from "@playwright/test";
import { isAppSelected } from "./selected-apps";

type AppExpectation = Readonly<{
  /** Workspace folder name under apps/, matched against E2E_APPS. */
  id: string;
  name: string;
  url: string;
  title: RegExp;
  navigation: readonly string[];
  theme: Readonly<{ primary: string; background: string }>;
  removedRoutes: readonly string[];
  /** Users grid headers on /reports; undefined when the app has no Users module. */
  usersGridColumns?: readonly string[];
}>;

const applications: readonly AppExpectation[] = [
  {
    id: "simplitrain_lite",
    name: "Application 1",
    url: "http://localhost:3001",
    title: /Application 1/,
    navigation: ["Home", "Admin", "Reports"],
    theme: { primary: "#1d4ed8", background: "rgb(234, 241, 255)" },
    removedRoutes: ["/products", "/module-b", "/api/v1/products"],
    usersGridColumns: [
      "User",
      "Employee code",
      "Department",
      "Designation",
      "Date of joining",
      "Status",
    ],
  },
  {
    id: "application-2",
    name: "Application 2",
    url: "http://localhost:3002",
    title: /Application 2/,
    navigation: ["Home", "Reports", "Accounting", "Settings"],
    theme: { primary: "#15803d", background: "rgb(236, 246, 239)" },
    removedRoutes: ["/catalog", "/module-e", "/api/catalog/products"],
    usersGridColumns: [
      "User",
      "Email",
      "Phone",
      "Employee code",
      "Department",
      "Designation",
      "City",
      "Country",
      "Date of joining",
      "Role",
      "Status",
    ],
  },
  {
    id: "application-3",
    name: "Application 3",
    url: "http://localhost:3003",
    title: /Application 3/,
    navigation: ["Home", "Course Catalog", "Event Schedule"],
    theme: { primary: "#c084fc", background: "rgb(15, 10, 31)" },
    removedRoutes: ["/products", "/module-f", "/reports", "/api/users"],
  },
];

function mainNavigation(page: Page) {
  return page.getByRole("navigation", { name: "Main navigation" });
}

for (const app of applications.filter((app) => isAppSelected(app.id))) {
  test(`${app.name} shows the SimpliTrain header with its own navigation`, async ({
    page,
  }) => {
    await page.goto(app.url);

    await expect(page).toHaveTitle(app.title);
    const theme = await page.locator("body").evaluate((body) => {
      const styles = getComputedStyle(body);
      return {
        primary: styles.getPropertyValue("--color-primary").trim(),
        background: styles.backgroundColor,
      };
    });
    expect(theme).toEqual(app.theme);
    await expect(
      page.getByRole("link", { name: "SimpliTrain home" }),
    ).toBeVisible();
    await expect(mainNavigation(page).getByRole("link")).toHaveText([
      ...app.navigation,
    ]);
    await expect(
      page.getByRole("button", { name: "Language: English" }),
    ).toBeVisible();

    for (const label of app.navigation) {
      const link = mainNavigation(page).getByRole("link", {
        name: label,
        exact: true,
      });
      await link.click();
      await expect(link).toHaveAttribute("aria-current", "page");
      await expect(
        page.getByRole("heading", { level: 1, name: label }),
      ).toBeVisible();
    }
  });

  const { usersGridColumns } = app;
  if (usersGridColumns) {
    test(`${app.name} Reports shows the users grid and creates a user`, async ({
      page,
    }) => {
      // Mock the app's own /api/users so the test never writes to the real users service.
      const users = [
        {
          id: 1,
          first_name: "Aarav",
          last_name: "Sharma",
          primary_email: "aarav@example.com",
          role: "user",
          primary_phone: "9000007919",
          department: "Engineering",
          city: "Pune",
          country: "India",
          status: "active",
        },
      ];
      const createdBodies: unknown[] = [];
      await page.route("**/api/users", async (route) => {
        if (route.request().method() === "POST") {
          const body = route.request().postDataJSON() as Record<string, string>;
          createdBodies.push(body);
          const created = { id: 2, ...body, status: body.status ?? "active" };
          users.push(created as (typeof users)[number]);
          await route.fulfill({
            status: 201,
            json: { success: true, data: created },
          });
          return;
        }
        await route.fulfill({ json: { success: true, data: users } });
      });

      await page.goto(`${app.url}/reports`);

      await expect(
        page.getByRole("heading", { name: "User Management" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Users", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("cell", { name: /Aarav Sharma/ }),
      ).toBeVisible();
      await expect(page.getByRole("columnheader")).toHaveText([
        ...usersGridColumns,
      ]);

      await page.getByRole("button", { name: "+ Create User" }).click();
      const dialog = page.getByRole("dialog", { name: "Create user" });
      await dialog.getByLabel("First name").fill("Meera");
      await dialog.getByLabel("Email").fill("meera@example.com");
      await dialog.getByLabel("Password").fill("secret-123");
      await dialog.getByRole("button", { name: "Create user" }).click();

      await expect(page.getByText("Meera was created.")).toBeVisible();
      await expect(
        page.getByRole("cell", { name: /meera@example.com/ }),
      ).toBeVisible();
      expect(createdBodies).toEqual([
        {
          first_name: "Meera",
          primary_email: "meera@example.com",
          password: "secret-123",
          role: "user",
          status: "active",
        },
      ]);
    });
  }

  test(`${app.name} no longer serves the removed pages`, async ({ page }) => {
    for (const route of app.removedRoutes) {
      const response = await page.goto(`${app.url}${route}`);
      expect(response?.status(), route).toBe(404);
    }
  });
}
