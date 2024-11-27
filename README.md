# Social Media API

A modern API for managing social media posts across multiple platforms. Built with Bun, Hono, and Drizzle ORM.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Framework**: [Hono](https://hono.dev/) - Lightweight, fast web framework
- **Database**: [Neon Postgres](https://neon.tech/) - Serverless Postgres
- **ORM**: [Drizzle](https://orm.drizzle.team/) - TypeScript ORM
- **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation

## Project Structure

```
social-api/
├── src/
│   ├── db/
│   │   ├── index.ts    # Database connection
│   │   └── schema.ts   # Database schema
│   ├── routes/
│   │   ├── users.ts    # User routes
│   │   └── posts.ts    # Post routes
│   └── utils/
│       ├── types.ts    # Type definitions
│       └── validate.ts # Validation schemas
├── drizzle/           # Database migrations
├── .env              # Environment variables
├── drizzle.config.ts # Drizzle configuration
├── index.ts         # Application entry point
└── package.json
```

## Setup

1. Prerequisites:
   - Install [Bun](https://bun.sh/)
   - Create a [Neon](https://neon.tech/) account and database

2. Install dependencies:
```bash
bun install
```

3. Environment setup:
```bash
# Create .env file
cp .env.example .env

# Add your Neon database URL
DATABASE_URL=your_neon_postgres_url
```

4. Database setup:
```bash
# Generate migrations
bun run db:generate

# Push migrations to database
bun run db:push
```

5. Start the server:
```bash
bun run dev
```

## API Endpoints

### Users

#### Create User
```http
POST /api/v1/users
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Get All Users
```http
GET /api/v1/users
```

#### Get User by ID
```http
GET /api/v1/users/:id
```

#### Update User
```http
PATCH /api/v1/users/:id
Content-Type: application/json

{
  "email": "newemail@example.com"
}
```

#### Delete User
```http
DELETE /api/v1/users/:id
```

#### Regenerate API Key
```http
POST /api/v1/users/:id/regenerate-key
```

### Posts

#### Create Post
```http
POST /api/v1/posts
Content-Type: application/json

{
  "content": "Hello World!",
  "mediaUrls": ["image1.jpg"],
  "platform": "twitter",
  "status": "draft",
  "scheduledFor": "2024-12-01T10:00:00Z"
}
```

#### Get All Posts
```http
GET /api/v1/posts
```

#### Get User's Posts
```http
GET /api/v1/posts/user/:userId
```

#### Get Post by ID
```http
GET /api/v1/posts/:id
```

#### Update Post
```http
PATCH /api/v1/posts/:id
Content-Type: application/json

{
  "content": "Updated content",
  "status": "published"
}
```

#### Delete Post
```http
DELETE /api/v1/posts/:id
```

Example Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "content": "Hello World!",
    "mediaUrls": ["image1.jpg"],
    "platform": "twitter",
    "status": "draft",
    "scheduledFor": "2024-12-01T10:00:00Z",
    "publishedAt": null,
    "createdAt": "2024-11-26T12:00:00Z",
    "updatedAt": "2024-11-26T12:00:00Z"
  }
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing API key)
- `404` - Not Found
- `500` - Server Error

## Type Definitions

### User
```typescript
interface User {
  id: string;
  email: string;
  apiKey: string | null;
  createdAt: Date | null;
}
```

### Post
```typescript
interface Post {
  id: string;
  userId: string;
  content: string;
  mediaUrls: string[];
  platform: 'twitter' | 'facebook' | 'instagram';
  status: 'draft' | 'published' | 'scheduled';
  publishedAt: Date | null;
  scheduledFor: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### API Response
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## Future Enhancements

- [ ] Authentication/Authorization
- [ ] Post Scheduling
- [ ] Analytics Dashboard
- [ ] Media Upload Support
- [ ] Rate Limiting
- [ ] Caching
- [ ] Comments System
- [ ] Like/Unlike Posts
- [ ] User Following System
- [ ] Social Platform Integration
- [ ] Content Moderation
- [ ] Hashtag System

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Bun](https://bun.sh/)
- [Hono](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Neon](https://neon.tech/)