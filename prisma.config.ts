import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Vercel provides environment variables natively, so we just use process.env
    url: process.env.DATABASE_URL!,
  },
});