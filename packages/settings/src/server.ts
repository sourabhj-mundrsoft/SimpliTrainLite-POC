import fs from "node:fs";
import path from "node:path";
import { defaultThemeSettings, type SharedThemeSettings } from "./types";

// In-memory cache
let inMemoryTheme: SharedThemeSettings = { ...defaultThemeSettings };

function resolveStorePath(customPath?: string): string {
  if (customPath) return customPath;
  // Try locating a shared .data/branding-store.json or workspace root
  try {
    const cwd = process.cwd();
    // In monorepo: apps/simplitrain_lite or packages/settings
    const candidatePaths = [
      path.resolve(cwd, ".data", "branding-store.json"),
      path.resolve(cwd, "..", "..", ".data", "branding-store.json"),
      path.resolve(cwd, "..", ".data", "branding-store.json"),
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) return p;
    }
    // Default to candidate in workspace root
    return candidatePaths[1];
  } catch {
    return path.resolve(process.cwd(), ".data", "branding-store.json");
  }
}

function loadThemeFromDisk(filePath: string): SharedThemeSettings {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        inMemoryTheme = { ...defaultThemeSettings, ...parsed };
        return inMemoryTheme;
      }
    }
  } catch (err) {
    console.warn("[@lms/settings/server] Notice: Could not read theme store file, using in-memory state.", err);
  }
  return inMemoryTheme;
}

function saveThemeToDisk(filePath: string, theme: SharedThemeSettings): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(theme, null, 2), "utf-8");
  } catch (err) {
    console.warn("[@lms/settings/server] Notice: Could not write theme store file, saved in-memory.", err);
  }
}

/**
 * Creates Next.js route handlers for GET / POST / PUT to /api/settings/branding
 */
export function createBrandingRouteHandlers(options?: { dataFilePath?: string }) {
  const storePath = resolveStorePath(options?.dataFilePath);

  // Initial load
  loadThemeFromDisk(storePath);

  return {
    GET: async () => {
      const current = loadThemeFromDisk(storePath);
      return Response.json(
        { success: true, branding: current },
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    },

    POST: async (request: Request) => {
      try {
        const body = await request.json();
        const existing = loadThemeFromDisk(storePath);

        const updated: SharedThemeSettings = {
          ...existing,
          ...body,
          updatedAt: new Date().toISOString(),
        };

        inMemoryTheme = updated;
        saveThemeToDisk(storePath, updated);

        return Response.json(
          { success: true, branding: updated },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      } catch (err) {
        return Response.json(
          { success: false, message: "Invalid request payload or failed to persist branding." },
          { status: 400 }
        );
      }
    },

    OPTIONS: async () => {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    },
  };
}
