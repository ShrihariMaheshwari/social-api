import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { createUserSchema } from "../utils/validate";
import type { ApiResponse, User } from "../utils/types";

const userRoutes = new Hono();

// Create user
userRoutes.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = createUserSchema.parse(body);

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: "User with this email already exists",
      };
      return c.json(response, 400);
    }

    const newUser = await db.insert(users).values({ email }).returning();

    const response: ApiResponse<User> = {
      success: true,
      data: newUser[0] as User, // Type assertion since we know the structure
    };
    return c.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: ApiResponse<null> = {
        success: false,
        error: error.errors[0].message,
      };
      return c.json(response, 400);
    }

    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to create user",
    };
    return c.json(response, 500);
  }
});

// Get user by ID
userRoutes.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

    if (!user.length) {
      const response: ApiResponse<null> = {
        success: false,
        error: "User not found",
      };
      return c.json(response, 404);
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user[0] as User,
    };
    return c.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch user",
    };
    return c.json(response, 500);
  }
});

// Get all users
userRoutes.get("/", async (c) => {
  try {
    const allUsers = await db.select().from(users);

    const response: ApiResponse<User[]> = {
      success: true,
      data: allUsers as User[],
    };
    return c.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch users",
    };
    return c.json(response, 500);
  }
});

export { userRoutes };
