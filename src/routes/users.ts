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
      data: newUser[0] as User, 
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

// Update user
userRoutes.patch("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    // Validate update data
    const updateSchema = z.object({
      email: z.string().email().optional(),
    });

    const validData = updateSchema.parse(body);

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser.length) {
      const response: ApiResponse<null> = {
        success: false,
        error: "User not found",
      };
      return c.json(response, 404);
    }

    // Update user
    const updatedUser = await db
      .update(users)
      .set(validData)
      .where(eq(users.id, id))
      .returning();

    const response: ApiResponse<User> = {
      success: true,
      data: updatedUser[0] as User,
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
      error: "Failed to update user",
    };
    return c.json(response, 500);
  }
});

// Delete user
userRoutes.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser.length) {
      const response: ApiResponse<null> = {
        success: false,
        error: "User not found",
      };
      return c.json(response, 404);
    }

    // Delete user
    await db.delete(users).where(eq(users.id, id));

    const response: ApiResponse<null> = {
      success: true,
      data: null,
    };
    return c.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to delete user",
    };
    return c.json(response, 500);
  }
});

// Regenerate API Key
userRoutes.post("/:id/regenerate-key", async (c) => {
  try {
    const id = c.req.param("id");

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser.length) {
      const response: ApiResponse<null> = {
        success: false,
        error: "User not found",
      };
      return c.json(response, 404);
    }

    // Update API key
    const updatedUser = await db
      .update(users)
      .set({
        apiKey: crypto.randomUUID(),
      })
      .where(eq(users.id, id))
      .returning();

    const response: ApiResponse<User> = {
      success: true,
      data: updatedUser[0] as User,
    };
    return c.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to regenerate API key",
    };
    return c.json(response, 500);
  }
});

export { userRoutes };
