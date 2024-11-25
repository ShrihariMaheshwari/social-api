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
│   │   └── users.ts    # User routes
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

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "apiKey": "uuid",
    "createdAt": "timestamp"
  }
}
```

#### Get All Users
```http
GET /api/v1/users
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "apiKey": "uuid",
      "createdAt": "timestamp"
    }
  ]
}
```

#### Get User by ID
```http
GET /api/v1/users/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "apiKey": "uuid",
    "createdAt": "timestamp"
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
- `404` - Not Found
- `500` - Server Error

## Development

Start the development server:
```bash
bun run dev
```

Run database migrations:
```bash
bun run db:generate  # Generate migrations
bun run db:push     # Push to database
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
- [ ] Social Media Platform Integration
- [ ] Post Scheduling
- [ ] Analytics
- [ ] Media Upload Support
- [ ] Rate Limiting
- [ ] Caching

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Bun](https://bun.sh/)
- [Hono](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Neon](https://neon.tech/)