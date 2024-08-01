import { main } from "@effective/eslint-config"

export default [
  {
    ...main,

    rules: {
      ...main.rules,

      "@typescript-eslint/no-magic-numbers": "off",
      "unicorn/prevent-abbreviations": "off"
    }
  }
]
