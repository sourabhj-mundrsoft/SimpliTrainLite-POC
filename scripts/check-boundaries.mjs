import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = process.cwd();
const importPattern = /\b(?:from\s*|import\s*(?:\(\s*)?)["']([^"']+)["']/g;
const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const failures = [];

async function listDirectories(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((e) => e.name);
}

async function listSourceFiles(directory) {
  const files = [];

  async function visit(currentDirectory) {
    for (const entry of await readdir(currentDirectory, {
      withFileTypes: true,
    })) {
      const fullPath = join(currentDirectory, entry.name);
      if (entry.isDirectory()) {
        await visit(fullPath);
      } else if (
        sourceExtensions.has(fullPath.slice(fullPath.lastIndexOf(".")))
      ) {
        files.push(fullPath);
      }
    }
  }

  await visit(directory);
  return files;
}

function importsApplication(specifier) {
  return (
    specifier.includes("apps/") || specifier.startsWith("@lms/application-")
  );
}

async function checkImports(directory) {
  for (const file of await listSourceFiles(directory)) {
    const source = await readFile(file, "utf8");
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1];
      if (importsApplication(specifier)) {
        failures.push(
          `${relative(root, file)} imports application source: ${specifier}`,
        );
      }
    }
  }
}

for (const application of await listDirectories(join(root, "apps"))) {
  const directory = join(root, "apps", application);
  await checkImports(join(directory, "src"));

  const manifest = JSON.parse(
    await readFile(join(directory, "package.json"), "utf8"),
  );
  const declaredDependencies = Object.keys({
    ...manifest.dependencies,
    ...manifest.devDependencies,
    ...manifest.peerDependencies,
    ...manifest.optionalDependencies,
  });
  for (const name of declaredDependencies) {
    if (name.startsWith("@lms/application-")) {
      failures.push(`${application} declares a dependency on app ${name}`);
    }
  }
}

for (const packageName of await listDirectories(join(root, "packages"))) {
  await checkImports(join(root, "packages", packageName, "src"));
}

if (failures.length > 0) {
  console.error("Workspace boundary violations:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    "Workspace boundaries passed: no app-to-app imports or dependencies, and no package-to-app imports.",
  );
}
