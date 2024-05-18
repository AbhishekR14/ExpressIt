import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinSchema, signupSchema } from "../src/zod";

const userRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRoute.post("/signup", async (c) => {
  const body = await c.req.json(); //Getting the body
  const checkBody = signupSchema.safeParse(body);
  console.log(checkBody);
  if (!checkBody.success) {
    c.status(403);
    return c.json({ error: "Incorrect Inputs" });
  }
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
      const token = await sign({ id: responseUser.id }, c.env.JWT_SECRET);
      console.log(token);
    }
  } catch (e) {
    c.status(403);
    return c.json({ error: "Error while signing up" });
  }
});

userRoute.post("/signin", async (c) => {
  const body = await c.req.json();
  const checkBody = signinSchema.safeParse(body);
  console.log(checkBody);
  if (!checkBody.success) {
    c.status(403);
    return c.json({ error: "Incorrect Inputs" });
  }
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

export default userRoute;
