import { Hono } from "hono";
import userRoute from "../routes/user";
import blogRoute from "../routes/blog";

const app = new Hono().basePath("/api/v1"); //All the paths will begin with /api/v1

app.route("/user", userRoute); //All the requests coming to /api/v1/user will go to userRoute
app.route("/blog", blogRoute); //All the requests coming to /api/v1/blog will go to blogRoute

export default app;
