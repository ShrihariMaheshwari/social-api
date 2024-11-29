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
├── drizzle/            # Database migrations
├── .env                # Environment variables
├── drizzle.config.ts   # Drizzle configuration
├── index.ts            # Application entry point
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

## API Testing

### Users

```bash
# Create User
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Get All Users
curl http://localhost:3000/api/v1/users

# Get User by ID
curl http://localhost:3000/api/v1/users/user-id

# Update User
curl -X PATCH http://localhost:3000/api/v1/users/user-id \
  -H "Content-Type: application/json" \
  -d '{"email": "newemail@example.com"}'

# Delete User
curl -X DELETE http://localhost:3000/api/v1/users/user-id

# Regenerate API Key
curl -X POST http://localhost:3000/api/v1/users/user-id/regenerate-key
```

### Posts

```bash
# Create Post
curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "X-User-ID: user-id" \
  -d '{
    "content": "Hello World!",
    "mediaUrls": ["https://example.com/image.jpg"],
    "platform": "twitter",
    "status": "draft"
  }'

# Get All Posts
curl http://localhost:3000/api/v1/posts

# Get User's Posts
curl http://localhost:3000/api/v1/posts/user/user-id

# Get Post by ID
curl http://localhost:3000/api/v1/posts/post-id

# Update Post
curl -X PATCH http://localhost:3000/api/v1/posts/post-id \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'

# Delete Post
curl -X DELETE http://localhost:3000/api/v1/posts/post-id
```

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

## License

MIT License

## Acknowledgments

- [Bun](https://bun.sh/)
- [Hono](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Neon](https://neon.tech/)