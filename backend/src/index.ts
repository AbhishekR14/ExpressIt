import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const app = new Hono<{Bindings: {DATABASE_URL: string;};}>().basePath("/api/v1"); //All the paths will begin with /api/v1

app.post("/user/signup", (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  return c.text("Hello Hono!");
});

app.post("/user/signin", (c) => {
  return c.text("Hello Hono!");
});

app.post("/blog", (c) => {
  return c.text("Hello Hono!");
});

app.put("/blog", (c) => {
  return c.text("Hello Hono!");
});

app.get("/blog/:id", (c) => {
  return c.text("Hello Hono!");
});

app.get("/blog/bulk", (c) => {
  return c.text("Hello Hono!");
});

export default app;
