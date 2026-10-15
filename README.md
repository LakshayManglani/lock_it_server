# LockIt Server

The backend REST API server for **LockIt**, a property and space rental booking platform. Built with Express 5, TypeScript, Prisma ORM, and PostgreSQL.

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed and set up:

- **Node.js**: `>= 22.0.0`
- **pnpm**: `>= 10.0.0`
- **PostgreSQL**: A running database instance (local or cloud)
- **Cloudinary Account**: For handling listing image uploads

---

## 🚀 Getting Started

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/LakshayManglani/lockit_server.git
cd lockit_server
pnpm install
```

> **Note:** `pnpm install` automatically triggers `prisma generate` via the postinstall script.

### 2. Configure Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Fill in the required environment variables:

```env
NODE_ENV=development
APP_ENV=development
PORT=8000
CORS_ORIGIN=http://localhost:5173

# Database connection
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/lockit?schema=public

# JWT secrets (generate with: openssl rand -hex 32)
ACCESS_TOKEN_SECRET=<your_access_token_secret>
ACCESS_TOKEN_EXPIRES=86400
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
REFRESH_TOKEN_EXPIRES=2592000

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

### 3. Initialize the Database

Run migrations to set up the database tables:

```bash
pnpm db:migrate
```

### 4. Run the Server

#### Development mode (with live reload)

```bash
pnpm dev
```

The server will start on `http://localhost:8000` (or the configured `PORT`). You can test it by visiting `http://localhost:8000/health`.

#### Production build

```bash
pnpm build
pnpm start
```

---

## 📜 Available Scripts

| Command             | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| `pnpm dev`          | Starts server in watch mode using `tsx`                        |
| `pnpm build`        | Cleans `dist` and builds TypeScript with path alias resolution |
| `pnpm start`        | Runs the compiled production build from `dist/`                |
| `pnpm typecheck`    | Type-checks code with `tsc --noEmit`                           |
| `pnpm lint`         | Runs ESLint checks                                             |
| `pnpm lint:fix`     | Automatically fixes ESLint warnings/errors                     |
| `pnpm format`       | Formats code with Prettier                                     |
| `pnpm format:check` | Checks code formatting with Prettier                           |
| `pnpm db:migrate`   | Creates and applies migrations in development                  |
| `pnpm db:deploy`    | Applies pending migrations in production                       |
| `pnpm db:push`      | Pushes the schema state directly to the database               |
| `pnpm db:studio`    | Launches Prisma Studio GUI                                     |
| `pnpm db:reset`     | Resets the database and reapplies all migrations               |

---

## 📖 API Documentation

Detailed information about routes, request payloads, response envelope, and authentication can be found in [`API_ROUTES.md`](./API_ROUTES.md).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
