import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";

import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/middlewares/session";

import { loginSchema, signupSchema } from "../schemas";
import { AUTH_COOKIE } from "../constants";

const app = new Hono()
  .get("/current", sessionMiddleware, (context) => {
    const user = context.get("user");

    return context.json({ data: user });
  })
  .post("/login", zValidator("json", loginSchema), async (context) => {
    const { email, password } = context.req.valid("json");

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(context, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return context.json({ success: true });
  })
  .post("/register", zValidator("json", signupSchema), async (context) => {
    const { name, email, password } = context.req.valid("json");

    const { account } = await createAdminClient();
    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(context, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return context.json({ success: true });
  })
  .post("/logout", sessionMiddleware, async (context) => {
    const account = context.get("account");

    deleteCookie(context, AUTH_COOKIE);
    await account.deleteSession("current");

    return context.json({ success: true });
  });

export default app;
