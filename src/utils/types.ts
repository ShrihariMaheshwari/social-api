
// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  apiKey: string | null;
  createdAt: Date | null;
}

// Post Types
export interface Post {
  id: string;
  userId: string;
  content: string;
  mediaUrls: string[];
  platform: PostPlatform;
  status: PostStatus;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PostPlatform = 'twitter' | 'facebook' | 'instagram';
export type PostStatus = 'draft' | 'published' | 'scheduled';

export interface CreatePostData {
  content: string;
  mediaUrls?: string[];
  platform: PostPlatform;
  status: PostStatus;
  scheduledFor?: Date | null;
}

export interface UpdatePostData {
  content?: string;
  mediaUrls?: string[];
  platform?: PostPlatform;
  status?: PostStatus;
  scheduledFor?: Date | null;
  updatedAt: Date;
  publishedAt?: Date | null;
}