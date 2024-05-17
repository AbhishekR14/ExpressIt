import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify, decode } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>().basePath("/api/v1"); //All the paths will begin with /api/v1

app.use("/blog/*", async (c, next) => {
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

app.post("/user/signup", async (c) => {
  const body = await c.req.json(); //Getting the body
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const responseUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
    });
    if (responseUser) {
      console.log("Hi");
      const token = await sign({ id: responseUser.id }, c.env.JWT_SECRET);
      console.log(token);
      return c.json({ token });
    }
  } catch (e) {
    c.status(403);
    return c.json({ error: "Error while signing up" });
  }
});

app.post("/user/signin", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const foundUser = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
    });
    if (foundUser) {
      console.log(c.env.JWT_SECRET);
      const token = await sign({ id: foundUser.id }, c.env.JWT_SECRET);
      console.log(token);
      return c.json({ token });
    } else {
      c.status(403);
      return c.json({ message: "Invalid credentials. Try Again!" });
    }
  } catch (e) {
    c.status(403);
    return c.json({ message: "Invalid credentials. Try Again!" });
  }
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
