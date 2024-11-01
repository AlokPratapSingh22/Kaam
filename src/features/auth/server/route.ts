import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";

import { createAdminClient } from "@/lib/appwrite";

import { loginSchema, signupSchema } from "../schemas";
import { AUTH_COOKIE } from "../constants";

const app = new Hono()
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
  .post("/logout", (context) => {
    deleteCookie(context, AUTH_COOKIE);

    return context.json({ success: true });
  });

export default app;
