# Node Service - URL Shortener with JWT Authentication

A full-stack Node.js web application featuring URL shortening functionality with secure JWT-based authentication and token refresh capabilities.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Token Refresh**: Database-managed refresh tokens with revocation support
- **Multi-Device Logout**: Ability to logout from all devices at once
- **URL Shortener**: Create, edit, and delete shortened URLs
- **User Profile**: Profile management with image upload
- **Password Management**: Change password with validation and password history
- **Email Verification**: Code-based and link-based email verification
- **Password Reset**: Forgot password with email reset link
- **Password Security**: Argon2 password hashing (winner of the Password Hashing Competition)
- **File Upload**: Profile image upload with Multer
- **Input Validation**: Schema-based validation using Zod
- **Flash Messages**: User feedback for actions and errors
- **Responsive UI**: EJS templating with server-side rendering

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js 5.x |
| Database | MySQL |
| ORM | Drizzle ORM |
| Templating | EJS |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | Argon2 |
| Validation | Zod |
| File Upload | Multer |
| Session Management | express-session |

## Project Structure

```
node-service/
├── index.js                 # Application entry point
├── package.json
├── .env                     # Environment variables
├── config/
│   ├── db.js               # Database connection configuration
│   └── constant.js         # Application constants
├── controller/
│   ├── authController.js   # Authentication handlers
│   ├── profileController.js # Profile & password handlers
│   └── shortnerControllerMySQL.js  # URL shortener handlers
├── service/
│   ├── auth-service.js     # Authentication business logic
│   ├── profile-service.js  # Profile business logic
│   └── verification-service.js # Email verification logic
├── model/
│   └── shortner-model.js   # Database queries for URL shortener
├── routes/
│   └── page.routes.js      # Route definitions
├── middlewares/
│   ├── verify-auth-middleware.js  # JWT verification middleware
│   └── upload-middleware.js       # Multer file upload config
├── validators/
│   ├── auth-validator.js         # Auth validation schemas
│   ├── password-validator.js     # Password validation schemas
│   └── verification-validator.js # Verification code schemas
├── drizzle/
│   ├── schema.js           # Database schema definitions
│   └── migrations/         # Database migrations
├── views/                  # EJS templates
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── shortner.ejs
│   ├── edit.ejs
│   ├── 404.ejs
│   └── profile/            # Profile-related views
│       ├── profile.ejs
│       ├── change-password.ejs
│       ├── forgot-password.ejs
│       └── reset-password.ejs
└── public/                 # Static assets
    ├── style.css
    └── uploads/
        └── profiles/       # Uploaded profile images
```

## Installation

### Prerequisites

- Node.js 18+ (for `--env-file` flag support)
- MySQL 8.0+

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   PORT=3001
   DATABASE_URL="mysql://root:password@localhost:3306/customerdb"
   JWT_SECRET=your_jwt_secret_key
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   SESSION_SECRET=your_session_secret
   ```

4. **Set up the database**
   ```bash
   # Generate migrations
   npm run db:generate

   # Run migrations
   npm run db:migrate
   ```

5. **Start the application**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Debug mode
   npm run debug
   ```

6. **Access the application**

   Open `http://localhost:3001` in your browser

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (default: 3000) |
| `DATABASE_URL` | MySQL connection string | Yes |
| `JWT_SECRET` | Secret key for access token signing | Yes |
| `REFRESH_TOKEN_SECRET` | Secret key for refresh token signing | Yes |
| `SESSION_SECRET` | Secret key for session management | No (has default) |

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm run debug` | Start server with Node.js inspector |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Drizzle Studio for database management |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/register` | Display registration page |
| `POST` | `/register` | Submit registration form |
| `GET` | `/login` | Display login page |
| `POST` | `/login` | Submit login credentials |
| `GET` | `/logout` | Logout user and clear tokens |
| `POST` | `/refresh-token` | Refresh access token |
| `POST` | `/logout-all-devices` | Revoke all refresh tokens for user |

### URL Shortener

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Dashboard/home page |
| `GET` | `/shortner` | View all shortened links |
| `POST` | `/shortner` | Create new shortened link |
| `GET` | `/shortCode/:shortCode` | Redirect to original URL |
| `GET` | `/edit/:id` | Display edit page for a link |
| `POST` | `/edit/:id` | Update a shortened link |
| `POST` | `/delete/:shortCodeId` | Delete a shortened link |

### Profile Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/profile` | View user profile page |
| `POST` | `/update-profile` | Update user profile (name, gender) |
| `POST` | `/upload-profile-image` | Upload profile image |
| `GET` | `/change-password` | Display change password page |
| `POST` | `/change-password` | Submit password change |
| `GET` | `/forgot-password` | Display forgot password page |
| `POST` | `/forgot-password` | Send password reset email |
| `GET` | `/reset-password` | Display reset password page |
| `POST` | `/reset-password` | Submit new password |

### Email Verification

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/send-verification-code` | Send email verification code |
| `POST` | `/verify-email` | Verify email with code |
| `GET` | `/verify-email` | Verify email from link |

## Authentication Flow

### Login Flow

```
1. User submits credentials → POST /login
2. Server validates credentials against database
3. Password verified using Argon2
4. On success:
   - Access token generated (1 hour expiry)
   - Refresh token generated (30 days expiry)
   - Refresh token saved to database with user agent info
   - Both tokens stored as HTTP-only cookies
5. User redirected to dashboard
```

### Token Refresh Flow

```
1. Access token expires (after 1 hour)
2. API requests return 401 with code "TOKEN_EXPIRED"
3. Client calls POST /refresh-token
4. Server validates refresh token (JWT signature + database lookup)
5. If valid: new access token issued
6. If invalid/revoked: all cookies cleared, 401 returned
7. Client retries original request or redirects to login
```

## JWT Token Refresh

The application implements a database-managed JWT refresh token mechanism with support for token revocation and multi-device session management.

### Token Configuration

| Token Type | Expiration | Storage |
|------------|------------|---------|
| Access Token | 1 hour | HTTP-only cookie (`access_token`) |
| Refresh Token | 30 days | HTTP-only cookie + Database (`refresh_token`) |

### Key Features

- **Token Revocation**: Refresh tokens can be revoked by deleting from database
- **Multi-Device Support**: Each login creates a new refresh token entry
- **Logout All Devices**: Revoke all refresh tokens for a user at once
- **Session Tracking**: User agent and IP address stored with each refresh token
- **IP Detection**: Uses `request-ip` package for accurate client IP detection (supports proxies)

### Refresh Endpoint

**Request:**
```http
POST /refresh-token
Content-Type: application/json
Cookie: refresh_token=<token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid or expired refresh token"
}
```

### Logout All Devices Endpoint

**Request:**
```http
POST /logout-all-devices
Cookie: access_token=<token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out from all devices"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

### Frontend Integration Example

```javascript
async function apiRequest(url, options = {}) {
  let response = await fetch(url, {
    ...options,
    credentials: 'include' // Include cookies
  });

  if (response.status === 401) {
    const data = await response.json();

    if (data.code === 'TOKEN_EXPIRED') {
      // Attempt to refresh the token
      const refreshResponse = await fetch('/refresh-token', {
        method: 'POST',
        credentials: 'include'
      });

      if (refreshResponse.ok) {
        // Retry the original request
        response = await fetch(url, {
          ...options,
          credentials: 'include'
        });
      } else {
        // Refresh failed, redirect to login
        window.location.href = '/login';
      }
    }
  }

  return response;
}
```

## Database Schema

### Users Table

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | BIGINT | Primary Key, Auto Increment |
| `name` | VARCHAR(255) | Not Null |
| `email` | VARCHAR(255) | Not Null, Unique |
| `password` | VARCHAR(255) | Not Null (Argon2 hash) |
| `created_at` | TIMESTAMP | Default: NOW() |
| `updated_at` | TIMESTAMP | Auto-update on modification |

### Short Links Table

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INT | Primary Key, Auto Increment |
| `url` | VARCHAR(255) | Not Null |
| `short_code` | VARCHAR(255) | Not Null, Unique |
| `user_id` | INT | Foreign Key → users.id |
| `created_at` | TIMESTAMP | Default: NOW() |
| `updated_at` | TIMESTAMP | Auto-update on modification |

### Refresh Tokens Table

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | BIGINT | Primary Key, Auto Increment |
| `token` | VARCHAR(500) | Not Null, Unique |
| `user_id` | BIGINT | Foreign Key → users.id (CASCADE DELETE) |
| `valid` | BOOLEAN | Not Null, Default: true |
| `expires_at` | TIMESTAMP | Not Null |
| `user_agent` | TEXT | Nullable (browser/device info) |
| `ip` | VARCHAR(255) | Nullable (client IP address) |
| `created_at` | TIMESTAMP | Default: NOW() |
| `updated_at` | TIMESTAMP | Auto-update on modification |

## File Upload

The application uses Multer for handling profile image uploads.

### Configuration

| Setting | Value |
|---------|-------|
| Storage Location | `public/uploads/profiles/` |
| Max File Size | 5 MB |
| Allowed Types | JPEG, PNG, GIF, WEBP |
| Filename Format | `profile-{userId}-{timestamp}-{random}.{ext}` |

### Upload Flow

```
1. User selects image file → POST /upload-profile-image
2. Multer middleware validates file type and size
3. File saved to public/uploads/profiles/
4. Old profile image deleted (if exists)
5. New image path stored in database
6. JSON response with image path returned
```

### Upload Endpoint

**Request:**
```http
POST /upload-profile-image
Content-Type: multipart/form-data
Cookie: access_token=<token>

profileImage: <file>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "imagePath": "/uploads/profiles/profile-1-1234567890-123456789.jpg"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Only image files (JPEG, PNG, GIF, WEBP) are allowed"
}
```

## Password Validation

The change password feature uses Zod schema validation:

| Rule | Requirement |
|------|-------------|
| Minimum Length | 3 characters |
| Maximum Length | 100 characters |
| Confirm Password | Must match new password |
| Password History | Cannot reuse last 5 passwords |

## Security Features

- **Password Hashing**: Argon2 algorithm (PHC winner, resistant to GPU attacks)
- **HTTP-only Cookies**: Tokens not accessible via JavaScript (XSS protection)
- **Separate Token Secrets**: Access and refresh tokens use different secrets
- **Token Revocation**: Database-stored refresh tokens can be revoked anytime
- **Cascade Delete**: When user is deleted, all refresh tokens are automatically removed
- **IP Address Tracking**: Client IP captured using `request-ip` for session monitoring
- **User Agent Logging**: Browser/device info stored for security auditing
- **Input Validation**: All user inputs validated with Zod schemas
- **Session Management**: Express session with configurable expiry

## Security Recommendations for Production

1. **Use HTTPS**: Enable secure cookie flag
   ```javascript
   res.cookie('access_token', token, {
     httpOnly: true,
     secure: true,  // Add this
     sameSite: 'strict'
   });
   ```

2. **Stronger Secrets**: Use long, random strings for `JWT_SECRET` and `REFRESH_TOKEN_SECRET`

3. **Environment Variables**: Never commit `.env` file to version control

4. **Rate Limiting**: Add rate limiting to authentication endpoints

5. **Password Requirements**: Enforce stronger password policies

## License

ISC
