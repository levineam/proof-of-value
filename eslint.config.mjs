import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // design/mockup is a standalone Next.js design reference with its own package.json
  // (U4 re-homes it into apps/web, where it is linted). Scoped out like the spike contract.
  { ignores: [".worktrees/**", "**/.next/**", "**/dist/**", "**/node_modules/**", "contracts/koinos/spike/**", "design/mockup/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["packages/{protocol,application-contracts}/test/**/*.mjs", "scripts/**/*.mjs", "tests/**/*.mjs"],
    languageOptions: { globals: { URL: "readonly", console: "readonly" } },
  },
  {
    files: ["apps/web/**/*.{js,jsx,ts,tsx}"],
    plugins: { "@next/next": next },
    rules: { ...next.configs["core-web-vitals"].rules, "@next/next/no-html-link-for-pages": "off" },
  },
);
