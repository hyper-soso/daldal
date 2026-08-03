export default {
  "web/**/*.{js,jsx,ts,tsx,mjs,cjs}": "pnpm --dir web exec eslint --fix",
  "crawler/**/*.{js,jsx,ts,tsx,mjs,cjs}":
    "pnpm --dir crawler exec eslint --fix",
};
