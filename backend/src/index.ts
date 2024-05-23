import { Hono } from "hono";
import userRoute from "../routes/user";
import blogRoute from "../routes/blog";
import homeRoute from "../routes/home";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api/v1"); //All the paths will begin with /api/v1

app.use(cors());
app.route("/user", userRoute); //All the requests coming to /api/v1/user will go to userRoute
app.route("/blog", blogRoute); //All the requests coming to /api/v1/blog will go to blogRoute
app.route("/home", homeRoute); //All the requests coming to /api/v1/home will go to homeRoute

export default app;
