import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

const homeRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

homeRoute.get("/", async (c) => {
  const authToken = c.req.header("Authorization")?.split(" ")[1] || "";
  try {
    const verifiedTokenPayload = await verify(authToken, c.env.JWT_SECRET);
    if (verifiedTokenPayload.id) {
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      try {
        const user = await prisma.user.findFirst({
          where: {
            id: verifiedTokenPayload.id,
          },
        });
        if (user) {
          return c.json({ userId: user.id, userName: user.name });
        }
      } catch (e) {
        c.status(403);
        return c.json({ error: "Errored while getting user" });
      }
    }
  } catch (e) {
    c.status(401);
    return c.json({ error: "Unauthorized, Please log in again" });
  }
});

export default homeRoute;
