import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db";
import { posts } from "../db/schema";
import { eq } from "drizzle-orm";
import { createPostSchema, updatePostSchema } from "../utils/validate";

import type {
  ApiResponse,
  Post,
  CreatePostData,
  UpdatePostData,
} from "../utils/types";

const postRoutes = new Hono();

// Create post
postRoutes.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const validData = createPostSchema.parse(body) as CreatePostData;

    const userId = c.req.header("X-User-ID");
    if (!userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Unauthorized",
      };
      return c.json(response, 401);
    }

    const newPost = await db
      .insert(posts)
      .values({
        ...validData,
        userId,
        publishedAt: validData.status === "published" ? new Date() : null,
        scheduledFor: validData.scheduledFor
          ? new Date(validData.scheduledFor)
          : null,
      })
      .returning();

    const response: ApiResponse<Post> = {
      success: true,
      data: newPost[0] as Post,
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
      error: "Failed to create post",
    };
    return c.json(response, 500);
  }
});

// Get all posts
postRoutes.get("/", async (c) => {
  try {
    const allPosts = await db.select().from(posts);

    const response: ApiResponse<Post[]> = {
      success: true,
      data: allPosts as Post[],
    };
    return c.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch posts",
    };
    return c.json(response, 500);
  }
});

// Get user's posts
postRoutes.get("/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId));

    const response: ApiResponse<Post[]> = {
      success: true,
      data: userPosts as Post[],
    };
    return c.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch user posts",
    };
    return c.json(response, 500);
  }
});

// Get post by ID
postRoutes.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const post = await db.select().from(posts).where(eq(posts.id, id)).limit(1);

    if (!post.length) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Post not found",
      };
      return c.json(response, 404);
    }

    const response: ApiResponse<Post> = {
      success: true,
      data: post[0] as Post,
    };
    return c.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to fetch post",
    };
    return c.json(response, 500);
  }
});

// Update post
postRoutes.patch("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const validData = updatePostSchema.parse(body);

    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!existingPost.length) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Post not found",
      };
      return c.json(response, 404);
    }

    const updateData: UpdatePostData = {
      ...validData,
      updatedAt: new Date(),
      scheduledFor: validData.scheduledFor
        ? new Date(validData.scheduledFor)
        : existingPost[0].scheduledFor,
    };

    if (
      validData.status === "published" &&
      existingPost[0].status !== "published"
    ) {
      updateData.publishedAt = new Date();
    }

    const updatedPost = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();

    const response: ApiResponse<Post> = {
      success: true,
      data: updatedPost[0] as Post,
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
      error: "Failed to update post",
    };
    return c.json(response, 500);
  }
});

// Delete post
postRoutes.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!existingPost.length) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Post not found",
      };
      return c.json(response, 404);
    }

    await db.delete(posts).where(eq(posts.id, id));

    const response: ApiResponse<null> = {
      success: true,
      data: null,
    };
    return c.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to delete post",
    };
    return c.json(response, 500);
  }
});

export { postRoutes };
