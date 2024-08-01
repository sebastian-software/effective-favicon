import { main } from "@effective/eslint-config"

export default [
  {
    ...main,

    rules: {
      ...main.rules,

      "@typescript-eslint/no-magic-numbers": "off",
      "@typescript-eslint/naming-convention": "off",
      "unicorn/prevent-abbreviations": "off",
      "no-await-in-loop": "off"
    }
  }
]
