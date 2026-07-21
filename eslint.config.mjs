import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["**/.next/**", "**/node_modules/**", "contracts/koinos/spike/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["apps/web/**/*.{js,jsx,ts,tsx}"],
    plugins: { "@next/next": next },
    rules: next.configs["core-web-vitals"].rules,
  },
);
