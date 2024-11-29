// index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { userRoutes } from "./src/routes/users";
import { postRoutes } from "./src/routes/posts";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger());
app.use("*", prettyJSON());

// Health check
app.get("/", (c) => {
  return c.json({
    success: true,
    data: {
      status: "ok",
      message: "Social Media API is running",
    },
  });
});

// Mount routes
app.route("/api/v1/users", userRoutes);
app.route("/api/v1/posts", postRoutes);

export default {
  port: 3000,
  fetch: app.fetch,
};
