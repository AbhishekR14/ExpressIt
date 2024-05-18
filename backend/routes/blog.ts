import { Hono } from "hono";
import { verify } from "hono/jwt";

const blogRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

//middleware, all the requests coming to /api/v1/blog will go thought this middleware
blogRoute.use("/*", async (c, next) => {
  const authToken = c.req.header("Authorization")?.split(" ")[1] || "";
  const verifiedTokenPayload = await verify(authToken, c.env.JWT_SECRET);
  if (verifiedTokenPayload.id) {
    c.set("userId", verifiedTokenPayload.id);
    await next();
  } else {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
});

blogRoute.post("/", (c) => {
  return c.text("Hello Hono!");
});

blogRoute.put("/", (c) => {
  return c.text("Hello Hono!");
});

blogRoute.get("/:id", (c) => {
  return c.text("Hello Hono!");
});

blogRoute.get("/bulk", (c) => {
  return c.text("Hello Hono!");
});

export default blogRoute;
