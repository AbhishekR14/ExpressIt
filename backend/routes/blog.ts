import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import {
  createPostSchema,
  updatePostSchema,
  onlyPostIdSchema,
} from "../src/zod";

const blogRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

function getDate(): string {
  // Get today's date
  const today = new Date();

  // Define an array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the day, month, and year from the date object
  const day = today.getDate();
  const month = monthNames[today.getMonth()];
  const year = today.getFullYear();

  // Format the date as "13 Dec 2024"
  const formattedDate = `${day} ${month} ${year}`;

  return formattedDate;
}

//middleware, all the requests coming to /api/v1/blog will go thought this middleware
blogRoute.use("/*", async (c, next) => {
  const authToken = c.req.header("Authorization")?.split(" ")[1] || "";
  try {
    const verifiedTokenPayload = await verify(authToken, c.env.JWT_SECRET);
    if (verifiedTokenPayload.id) {
      c.set("userId", verifiedTokenPayload.id);
      await next();
    }
  } catch (e) {
    c.status(401);
    return c.json({ error: "Unauthorized, Please log in again" });
  }
});

blogRoute.post("/", async (c) => {
  const body = await c.req.json();
  const checkBody = createPostSchema.safeParse(body);
  if (!checkBody.success) {
    c.status(403);
    return c.json({ error: "Incorrect Inputs" });
  }
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
        publishedDate: getDate(),
      },
    });
    return c.json({
      message: "Post created",
      postId: post.id,
    });
  } catch (e) {
    c.status(403);
    return c.json({ error: "Post could not be created" });
  }
});

blogRoute.put("/", async (c) => {
  const body = await c.req.json();
  const checkBody = updatePostSchema.safeParse(body);
  if (!checkBody.success) {
    c.status(403);
    return c.json({ error: "Incorrect Inputs" });
  }
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: body.postId,
        authorId: userId, //only the creater of the post can update the post
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return c.json({
      message: "Post updated",
      postId: updatedPost.id,
    });
  } catch (e) {
    c.status(403);
    return c.json({ error: "Post could not be updated" });
  }
});

blogRoute.delete("/", async (c) => {
  const body = await c.req.json();
  const checkBody = onlyPostIdSchema.safeParse(body);
  if (!checkBody.success) {
    c.status(403);
    return c.json({ error: "Incorrect Inputs" });
  }
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id: body.postId,
        authorId: userId, //only the creater of the post can delete the post
      },
    });
    return c.json({
      message: "Post deleted",
    });
  } catch (e) {
    c.status(403);
    return c.json({ error: "Post could not be deleted" });
  }
});

blogRoute.get("/post/:id", async (c) => {
  const postId = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const foundPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        publishedDate: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (foundPost) {
      return c.json({ Post: foundPost });
    } else {
      c.status(403);
      return c.json({ error: "Post could not be found" });
    }
  } catch (e) {
    c.status(403);
    return c.json({ error: "Post could not be found" });
  }
});

blogRoute.get("/publish/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const publishedPosts = await prisma.post.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        publishedDate: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (publishedPosts) {
      return c.json({ Posts: publishedPosts });
    } else {
      c.status(403);
      return c.json({ error: "No Posts publshed" });
    }
  } catch (e) {
    c.status(403);
    return c.json({ error: "Errored while getting posts" });
  }
});

blogRoute.get("/unpublish/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  try {
    const unPublishedPosts = await prisma.post.findMany({
      where: {
        published: false,
        authorId: userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        publishedDate: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (unPublishedPosts) {
      return c.json({ Posts: unPublishedPosts });
    } else {
      c.status(403);
      return c.json({ error: "No Unpublshed Posts" });
    }
  } catch (e) {
    c.status(403);
    return c.json({ error: "Errored while getting posts" });
  }
});

blogRoute.put("/publish", async (c) => {
  const body = await c.req.json();
  const checkBody = onlyPostIdSchema.safeParse(body);
  if (!checkBody.success) {
    c.status(403);
    return c.json({ error: "Incorrect Inputs" });
  }
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: body.postId,
        authorId: userId, //only the creater of the post can publish the post
      },
      data: {
        published: true,
      },
    });
    return c.json({
      message: "Post published",
      postId: updatedPost.id,
    });
  } catch (e) {
    c.status(403);
    return c.json({ error: "Post could not be published" });
  }
});

blogRoute.put("/unpublish", async (c) => {
  const body = await c.req.json();
  const checkBody = onlyPostIdSchema.safeParse(body);
  if (!checkBody.success) {
    c.status(403);
    return c.json({ error: "Incorrect Inputs" });
  }
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: body.postId,
        authorId: userId, //only the creater of the post can Unpublished the post
      },
      data: {
        published: false,
      },
    });
    return c.json({
      message: "Post Unpublished",
      postId: updatedPost.id,
    });
  } catch (e) {
    c.status(403);
    return c.json({ error: "Post could not be Unpublished" });
  }
});

blogRoute.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const allPosts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        publishedDate: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (allPosts) {
      return c.json({ Posts: allPosts });
    } else {
      c.status(403);
      return c.json({ error: "No Posts" });
    }
  } catch (e) {
    c.status(403);
    return c.json({ error: "Errored while getting posts" });
  }
});

export default blogRoute;
