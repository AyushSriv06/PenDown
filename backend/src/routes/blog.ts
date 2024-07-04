import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from 'hono/jwt'

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

blogRouter.use("/*", async (c, next) => {
    const header = c.req.header("authorization") || "";
    const token = header.split(" ")[1];

    const response = await verify(token, c.env.JWT_SECRET);
    if (response.id) {
        next()
    }
    else {
        c.status(403);
        return c.json({
            msg: "User can't be authenticated"
        })
    }
})


blogRouter.post("/api/v1/blog", (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    return c.text("hello");
})

blogRouter.put("/api/v1/blog", (c) => {
    return c.text("hello");
})

blogRouter.get("/api/v1/blog/:id", (c) => {
    return c.text("hello");
})

