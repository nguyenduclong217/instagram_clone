import type { Config } from "tailwindcss"
import containerQueries from "@tailwindcss/container-queries"

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [containerQueries],
}

export default config
