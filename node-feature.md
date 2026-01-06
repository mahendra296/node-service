# Node.js & Express.js Complete Reference Guide

## Table of Contents

1. [Node.js Features](#nodejs-features)
2. [Express.js Features](#expressjs-features)
3. [NPM Commands](#npm-commands)
4. [Running Node Applications](#running-node-applications)
   - [Older Node.js Versions (< v20.6.0)](#older-nodejs-versions--v2060)
   - [Latest Node.js Version (v20.6.0+)](#latest-nodejs-version-v2060)
5. [Environment Configuration](#environment-configuration)
   - [Older Node.js Versions (using dotenv)](#using-env-files-older-nodejs)
   - [Latest Node.js Version (built-in)](#using-env-files-latest-nodejs)
6. [Package Management](#package-management)
7. [Express Middleware Packages](#express-middleware-packages)
   - [Cookie Parser](#cookie-parser---detailed-guide)
   - [Express Session](#express-session---detailed-guide)
   - [Connect Flash](#connect-flash---detailed-guide)
8. [Best Practices](#best-practices)

---

## Node.js Features

### Core Features

**Asynchronous & Event-Driven**

- Non-blocking I/O operations
- Event loop for handling concurrent operations
- Callbacks, Promises, and async/await support

**Single-Threaded with Worker Threads**

- Main thread handles event loop
- Worker threads for CPU-intensive tasks
- Cluster module for multi-core utilization

**Built-in Modules**

- `fs` - File system operations
- `http`/`https` - HTTP server and client
- `path` - File path utilities
- `os` - Operating system information
- `crypto` - Cryptographic functionality
- `stream` - Stream handling
- `events` - Event emitter
- `child_process` - Spawn child processes
- `buffer` - Binary data handling
- `url` - URL parsing and formatting

**NPM Ecosystem**

- Largest package registry
- Easy dependency management
- Version control with package.json

**Cross-Platform**

- Runs on Windows, macOS, Linux
- Same codebase across platforms

---

## Express.js Features

### Core Features

**Minimal & Flexible Framework**

- Lightweight web application framework
- Unopinionated design
- Easy to extend with middleware

**Routing**

- HTTP method routing (GET, POST, PUT, DELETE, etc.)
- Route parameters and query strings
- Route chaining
- Route grouping with Router

**Middleware Support**

- Built-in middleware (express.json(), express.static())
- Third-party middleware (cors, morgan, helmet)
- Custom middleware creation
- Error-handling middleware

**Template Engine Integration**

- EJS, Pug, Handlebars support
- Dynamic HTML rendering
- View engine configuration

**Static File Serving**

- Serve static assets (CSS, JS, images)
- Multiple static directories

**Request & Response Objects**

- Enhanced req and res objects
- Easy access to headers, params, body
- Response methods (send, json, redirect, render)

**RESTful API Development**

- Perfect for building REST APIs
- JSON response handling
- Status code management

---

## NPM Commands

### Package Installation

**Install all dependencies from package.json**

```bash
npm install
# or short form
npm i
```

**Install a package**

```bash
npm install <package-name>
# Example
npm install express
```

**Install as development dependency**

```bash
npm install <package-name> --save-dev
# or short form
npm install <package-name> -D
# Example
npm install nodemon --save-dev
```

**Install globally**

```bash
npm install -g <package-name>
# Example
npm install -g nodemon
```

**Install specific version**

```bash
npm install <package-name>@<version>
# Example
npm install express@4.18.2
```

**Install latest version**

```bash
npm install <package-name>@latest
# Example
npm install express@latest
```

**Install from GitHub**

```bash
npm install <github-username>/<repository>
# Example
npm install expressjs/express
```

### Package Removal

**Uninstall a package**

```bash
npm uninstall <package-name>
# or
npm remove <package-name>
# or short form
npm rm <package-name>
# Example
npm uninstall lodash
```

**Uninstall global package**

```bash
npm uninstall -g <package-name>
# Example
npm uninstall -g nodemon
```

### Package Updates

**Update all packages**

```bash
npm update
```

**Update specific package**

```bash
npm update <package-name>
# Example
npm update express
```

**Check for outdated packages**

```bash
npm outdated
```

**Update to latest major version (use with caution)**

```bash
npm install <package-name>@latest
```

### Package Information

**List installed packages**

```bash
npm list
# or short form
npm ls
```

**List global packages**

```bash
npm list -g
```

**List only top-level packages**

```bash
npm list --depth=0
```

**View package information**

```bash
npm view <package-name>
# or
npm info <package-name>
```

**Search for packages**

```bash
npm search <keyword>
```

### NPM Scripts

**Run a script defined in package.json**

```bash
npm run <script-name>
# Example
npm run dev
```

**Run start script**

```bash
npm start
```

**Run test script**

```bash
npm test
# or short form
npm t
```

### NPM Initialization

**Initialize a new project**

```bash
npm init
```

**Initialize with defaults**

```bash
npm init -y
# or
npm init --yes
```

### Cache Management

**Clean npm cache**

```bash
npm cache clean --force
```

**Verify cache**

```bash
npm cache verify
```

---

## Running Node Applications

### Basic Execution

**Run a Node.js file**

```bash
node app.js
# or
node server.js
```

**Run with inspect mode (debugging)**

```bash
node --inspect app.js
# or with break on first line
node --inspect-brk app.js
```

---

### Older Node.js Versions (< v20.6.0)

For older Node.js versions, you need external packages for auto-restart and environment file loading.

#### Using Nodemon (Auto-restart on changes)

**Install nodemon**

```bash
npm install nodemon --save-dev
# or globally
npm install -g nodemon
```

**Run with nodemon**

```bash
nodemon app.js
```

**Run with custom extensions to watch**

```bash
nodemon --ext js,json,html app.js
```

**Run with specific watch directory**

```bash
nodemon --watch src app.js
```

**Run with ignore patterns**

```bash
nodemon --ignore tests/ app.js
```

**Run with nodemon and dotenv**

```bash
# Load environment variables with nodemon
nodemon -r dotenv/config app.js
```

#### Using dotenv for Environment Variables

```bash
# Install dotenv
npm install dotenv
```

```javascript
// Load at the top of your main file
require("dotenv").config();

// Or load via command line
// node -r dotenv/config app.js
```

---

### Latest Node.js Version (v20.6.0+)

Node.js v20.6.0+ has built-in support for loading environment files and watch mode, eliminating the need for external packages like `dotenv` and `nodemon` during development.

**Run with environment file and watch mode**

```bash
node --env-file=.env --watch index.js
```

**Run with only environment file**

```bash
node --env-file=.env index.js
```

**Run with only watch mode**

```bash
node --watch index.js
```

**Run with multiple environment files**

```bash
node --env-file=.env --env-file=.env.local index.js
```

**Run with environment file and debugging**

```bash
node --env-file=.env --inspect index.js
```

**Benefits of built-in flags:**

- No need to install `dotenv` package for environment variables
- No need to install `nodemon` for auto-restart on file changes
- Faster startup time without additional package overhead
- Native integration with Node.js runtime

---

### Version Comparison Table

| Feature              | Node.js v20.6.0+                        | Older Versions (< v20.6.0)          |
| -------------------- | --------------------------------------- | ----------------------------------- |
| Environment file     | `node --env-file=.env index.js`         | `node -r dotenv/config index.js`    |
| Watch mode           | `node --watch index.js`                 | `nodemon index.js`                  |
| Both combined        | `node --env-file=.env --watch index.js` | `nodemon -r dotenv/config index.js` |
| Dependencies needed  | None                                    | `dotenv`, `nodemon`                 |

---

### Using PM2 (Production Process Manager)

PM2 is recommended for production deployments (works with all Node.js versions).

**Install PM2**

```bash
npm install -g pm2
```

**Start application**

```bash
pm2 start app.js
```

**Start with name**

```bash
pm2 start app.js --name "my-app"
```

**Start with watch mode**

```bash
pm2 start app.js --watch
```

**List running processes**

```bash
pm2 list
```

**Stop application**

```bash
pm2 stop app.js
# or by name
pm2 stop my-app
```

**Restart application**

```bash
pm2 restart app.js
```

**Delete from PM2**

```bash
pm2 delete app.js
```

**View logs**

```bash
pm2 logs
```

**Monitor applications**

```bash
pm2 monit
```

---

## Environment Configuration

### Create .env file

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/mydb
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key
```

---

### Using .env Files (Older Node.js < v20.6.0)

For older Node.js versions, use the `dotenv` package to load environment variables.

**Install dotenv package**

```bash
npm install dotenv
```

**Load environment variables in your application**

```javascript
// At the top of your main file (app.js or server.js)
require("dotenv").config();

// Access variables
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
```

**Run with .env file**

```bash
# Method 1: Load in code (dotenv will auto-load .env file)
node app.js

# Method 2: Load via command line
node -r dotenv/config app.js
```

**Run with custom .env file**

```bash
node -r dotenv/config app.js dotenv_config_path=/path/to/.env.custom
```

**Using different environment files**

```javascript
// Load specific file in code
require("dotenv").config({ path: ".env.development" });
require("dotenv").config({ path: ".env.production" });
require("dotenv").config({ path: ".env.test" });
```

---

### Using .env Files (Latest Node.js v20.6.0+)

Node.js v20.6.0+ has built-in support for loading environment files. No need to install `dotenv` package!

**Run with environment file**

```bash
node --env-file=.env index.js
```

**Run with environment file and watch mode**

```bash
node --env-file=.env --watch index.js
```

**Run with multiple environment files**

```bash
node --env-file=.env --env-file=.env.local index.js
```

**Access variables in code (same as before)**

```javascript
// No need to require dotenv - variables are automatically loaded
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
```

**Benefits of built-in --env-file flag:**

- No need to install `dotenv` package
- No code changes required to load environment variables
- Cleaner application code
- Native integration with Node.js runtime

---

### Environment Variables in Different OS

**Set environment variable inline (Linux/Mac)**

```bash
PORT=4000 node app.js
```

**Set environment variable inline (Windows CMD)**

```cmd
set PORT=4000 && node app.js
```

**Set environment variable inline (Windows PowerShell)**

```powershell
$env:PORT=4000; node app.js
```

**Cross-platform solution using cross-env**

```bash
# Install cross-env
npm install cross-env --save-dev
```

```json
// Use in package.json scripts
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node app.js",
    "dev": "cross-env NODE_ENV=development nodemon app.js"
  }
}
```

---

### Environment Configuration Comparison

| Feature                | Older Node.js (< v20.6.0)                    | Latest Node.js (v20.6.0+)               |
| ---------------------- | -------------------------------------------- | --------------------------------------- |
| Package required       | `npm install dotenv`                         | None (built-in)                         |
| Load .env file         | `require('dotenv').config()` in code         | `node --env-file=.env` in command       |
| Command line loading   | `node -r dotenv/config app.js`               | `node --env-file=.env app.js`           |
| Multiple env files     | Load sequentially in code                    | `--env-file=.env --env-file=.env.local` |
| Custom env file path   | `dotenv.config({ path: '.env.custom' })`     | `node --env-file=.env.custom app.js`    |

---

## Package Management

### Package.json Structure

**Basic package.json**

```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "description": "My Node.js application",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest",
    "build": "webpack"
  },
  "keywords": ["node", "express"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.5.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### Common NPM Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "dev:watch": "node --watch server.js",
    "dev:env": "nodemon -r dotenv/config server.js",
    "prod": "NODE_ENV=production node server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "build": "webpack --mode production",
    "clean": "rm -rf dist"
  }
}
```

### Version Ranges in package.json

```json
{
  "dependencies": {
    "exact-version": "1.2.3", // Exact version
    "patch-updates": "~1.2.3", // Allow patch updates (1.2.x)
    "minor-updates": "^1.2.3", // Allow minor updates (1.x.x)
    "any-version": "*", // Any version (not recommended)
    "version-range": ">=1.2.3 <2.0.0", // Version range
    "latest": "latest" // Latest version (not recommended)
  }
}
```

### Package Lock

**package-lock.json**

- Locks exact versions of all dependencies
- Ensures consistent installs across environments
- Generated automatically by npm

**Install from lock file**

```bash
npm ci
# Faster, stricter installation for CI/CD
```

---

## Best Practices

### Project Structure

```
my-node-app/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── app.js
├── tests/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── views/
├── config/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### .gitignore Template

```
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# Runtime data
pids/
*.pid
*.seed

# Coverage directory
coverage/

# Build output
dist/
build/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
```

### Security Best Practices

**Install security tools**

```bash
npm install helmet cors express-rate-limit
```

**Check for vulnerabilities**

```bash
npm audit
```

**Fix vulnerabilities**

```bash
npm audit fix
# or force fix
npm audit fix --force
```

**Keep dependencies updated**

```bash
npm outdated
npm update
```

### Performance Tips

**Use production mode**

```bash
NODE_ENV=production node app.js
```

**Enable compression**

```bash
npm install compression
```

**Use clustering**

```javascript
const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Worker processes
  require("./app");
}
```

---

## Express.js Quick Start

### Basic Express Server

```javascript
const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Common Express Middleware

```bash
# Body parsing (built-in)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

# Static files (built-in)
app.use(express.static('public'));
# Serve from root URL: http://localhost:3000/style.css
app.use(express.static("public"));

# Serve with prefix: http://localhost:3000/static/style.css
app.use("/static", express.static("public"));

# Serve with custom prefix: http://localhost:3000/assets/style.css
app.use("/assets", express.static("public"));

# Different folders for different types
app.use("/css", express.static("public/stylesheets"));
app.use("/js", express.static("public/scripts"));
app.use("/images", express.static("public/images"));

# CORS
npm install cors
const cors = require('cors');
app.use(cors());

# Logging
npm install morgan
const morgan = require('morgan');
app.use(morgan('dev'));

# Security headers
npm install helmet
const helmet = require('helmet');
app.use(helmet());

# Rate limiting
npm install express-rate-limit
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

# Session management
npm install express-session
const session = require('express-session');
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

# Cookie parsing
npm install cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());
```

---

## Cookie Parser - Detailed Guide

The `cookie-parser` middleware parses Cookie header and populates `req.cookies` with an object keyed by cookie names.

### Installation

```bash
npm install cookie-parser
```

### Import & Setup

```javascript
// ES Module (recommended for modern Node.js)
import cookieParser from "cookie-parser";

// CommonJS
const cookieParser = require("cookie-parser");

// Use in Express app
app.use(cookieParser());

// With signed cookies (using a secret)
app.use(cookieParser("your-secret-key"));
```

### Core Functionality

**Reading Cookies**

```javascript
app.get("/", (req, res) => {
  // Access regular cookies
  console.log(req.cookies); // { cookieName: 'cookieValue' }

  // Access signed cookies (requires secret)
  console.log(req.signedCookies); // { signedCookieName: 'value' }

  // Get specific cookie
  const userId = req.cookies.userId;
  const token = req.signedCookies.authToken;
});
```

**Setting Cookies**

```javascript
app.get("/set-cookie", (req, res) => {
  // Set a simple cookie
  res.cookie("username", "john_doe");

  // Set cookie with options
  res.cookie("userId", "12345", {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    httpOnly: true, // Not accessible via JavaScript
    secure: true, // Only sent over HTTPS
    sameSite: "strict", // CSRF protection
  });

  // Set a signed cookie (tamper-proof)
  res.cookie("authToken", "abc123", { signed: true });

  res.send("Cookies set!");
});
```

**Clearing Cookies**

```javascript
app.get("/logout", (req, res) => {
  // Clear a cookie
  res.clearCookie("username");

  // Clear with same options used when setting
  res.clearCookie("userId", { httpOnly: true, secure: true });

  res.send("Logged out!");
});
```

### Cookie Options

| Option     | Description                                           |
| ---------- | ----------------------------------------------------- |
| `maxAge`   | Expiry time in milliseconds                           |
| `expires`  | Expiry date (Date object)                             |
| `httpOnly` | Cookie not accessible via JavaScript (XSS protection) |
| `secure`   | Only transmit over HTTPS                              |
| `sameSite` | CSRF protection: `'strict'`, `'lax'`, or `'none'`     |
| `path`     | Cookie path (default: `/`)                            |
| `domain`   | Cookie domain                                         |
| `signed`   | Sign the cookie (requires secret in cookieParser)     |

### Use Cases

- **User preferences**: Theme, language, layout settings
- **Shopping cart**: Store cart items for guest users
- **Analytics**: Track user sessions and behavior
- **Authentication tokens**: Store JWT or session IDs

---

## Express Session - Detailed Guide

The `express-session` middleware manages server-side sessions. It creates a session ID stored in a cookie, while actual session data is stored on the server.

### Installation

```bash
npm install express-session
```

### Import & Setup

```javascript
// ES Module (recommended for modern Node.js)
import session from "express-session";

// CommonJS
const session = require("express-session");

// Basic setup
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
```

### Configuration Options

```javascript
app.use(
  session({
    // Required: Secret used to sign the session ID cookie
    secret: process.env.SESSION_SECRET || "your-secret-key",

    // Don't save session if unmodified
    resave: false,

    // Don't create session until something is stored
    saveUninitialized: false,

    // Cookie configuration
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax", // CSRF protection
    },

    // Session name (default: connect.sid)
    name: "sessionId",

    // Rolling: Reset expiration on every response
    rolling: true,
  })
);
```

### Core Functionality

**Storing Session Data**

```javascript
app.post("/login", (req, res) => {
  // Store user data in session
  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.isAuthenticated = true;
  req.session.loginTime = new Date();

  res.json({ message: "Logged in successfully" });
});
```

**Reading Session Data**

```javascript
app.get("/profile", (req, res) => {
  // Check if user is authenticated
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Access session data
  const { userId, username, loginTime } = req.session;

  res.json({ userId, username, loginTime });
});
```

**Destroying Session (Logout)**

```javascript
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }

    // Clear the session cookie
    res.clearCookie("sessionId");
    res.json({ message: "Logged out successfully" });
  });
});
```

**Regenerating Session ID (Security)**

```javascript
app.post("/login", (req, res) => {
  // Regenerate session ID after login to prevent session fixation
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ error: "Session error" });
    }

    req.session.userId = user.id;
    req.session.isAuthenticated = true;

    res.json({ message: "Logged in" });
  });
});
```

### Session Stores (Production)

By default, sessions are stored in memory (not suitable for production). Use a session store:

**Redis Store (Recommended)**

```bash
npm install connect-redis redis
```

```javascript
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";

// Create Redis client
const redisClient = createClient();
await redisClient.connect();

// Configure session with Redis
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
```

**MongoDB Store**

```bash
npm install connect-mongo
```

```javascript
import session from "express-session";
import MongoStore from "connect-mongo";

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
```

### Session Options Reference

| Option             | Description                                     |
| ------------------ | ----------------------------------------------- |
| `secret`           | Required. Key to sign session ID cookie         |
| `resave`           | Force save session even if unmodified           |
| `saveUninitialized`| Save new sessions that haven't been modified    |
| `cookie`           | Cookie settings (maxAge, secure, httpOnly, etc) |
| `name`             | Session cookie name (default: `connect.sid`)    |
| `store`            | Session store instance (Redis, MongoDB, etc)    |
| `rolling`          | Reset cookie expiration on every response       |
| `unset`            | Control behavior when session is unset          |

### Cookie-Parser vs Express-Session

| Feature          | cookie-parser                  | express-session                    |
| ---------------- | ------------------------------ | ---------------------------------- |
| Data storage     | Client-side (in cookie)        | Server-side (store) + cookie ID    |
| Data size limit  | ~4KB per cookie                | Unlimited (server storage)         |
| Security         | Visible to client (unless signed) | Hidden on server                |
| Use case         | Preferences, tokens            | User sessions, authentication      |
| Scalability      | Stateless                      | Requires shared store for scaling  |

---

## Connect Flash - Detailed Guide

The `connect-flash` middleware provides flash messages - temporary messages stored in the session that are displayed once and then automatically deleted. Perfect for showing success/error messages after form submissions or redirects.

### Installation

```bash
npm install connect-flash
```

### Prerequisites

Flash messages require `express-session` to be configured first, as flash data is stored in the session.

### Import & Setup

```javascript
// ES Module (recommended for modern Node.js)
import flash from "connect-flash";

// CommonJS
const flash = require("connect-flash");

// Setup (must come AFTER session middleware)
import express from "express";
import session from "express-session";
import flash from "connect-flash";

const app = express();

// Session is required for flash to work
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize flash middleware
app.use(flash());
```

### Core Functionality

**Setting Flash Messages**

```javascript
// Set a flash message with a type/key
req.flash("success", "Your account has been created!");
req.flash("error", "Invalid email or password.");
req.flash("info", "Please verify your email address.");
req.flash("warning", "Your session will expire soon.");

// Set multiple messages of the same type
req.flash("error", "Email is required.");
req.flash("error", "Password must be at least 8 characters.");
```

**Reading Flash Messages**

```javascript
// Get all messages for a specific type (returns array)
const successMessages = req.flash("success"); // ['Your account has been created!']
const errorMessages = req.flash("error"); // ['Email is required.', 'Password must be...']

// Get all flash messages (returns object)
const allMessages = req.flash(); // { success: [...], error: [...] }
```

### Common Use Cases

**Form Submission with Redirect**

```javascript
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      req.flash("error", "All fields are required.");
      return res.redirect("/register");
    }

    // Create user...
    await createUser(email, password);

    req.flash("success", "Registration successful! Please login.");
    res.redirect("/login");
  } catch (error) {
    req.flash("error", "Registration failed. Please try again.");
    res.redirect("/register");
  }
});
```

**Login/Logout Flow**

```javascript
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await authenticateUser(email, password);

  if (!user) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }

  req.session.userId = user.id;
  req.flash("success", `Welcome back, ${user.name}!`);
  res.redirect("/dashboard");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  req.flash("info", "You have been logged out.");
  res.redirect("/login");
});
```

**Making Flash Messages Available to Views**

```javascript
// Middleware to pass flash messages to all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.info = req.flash("info");
  res.locals.warning = req.flash("warning");
  next();
});

// Now accessible in templates (EJS example)
app.get("/dashboard", (req, res) => {
  res.render("dashboard"); // Flash messages available as locals
});
```

**EJS Template Example**

```html
<!-- views/partials/flash.ejs -->
<% if (success && success.length > 0) { %>
  <div class="alert alert-success">
    <% success.forEach(msg => { %>
      <p><%= msg %></p>
    <% }) %>
  </div>
<% } %>

<% if (error && error.length > 0) { %>
  <div class="alert alert-danger">
    <% error.forEach(msg => { %>
      <p><%= msg %></p>
    <% }) %>
  </div>
<% } %>

<% if (info && info.length > 0) { %>
  <div class="alert alert-info">
    <% info.forEach(msg => { %>
      <p><%= msg %></p>
    <% }) %>
  </div>
<% } %>
```

### For REST APIs (JSON Response)

Flash messages are primarily for server-rendered apps. For REST APIs, return messages directly:

```javascript
// Instead of flash for APIs
app.post("/api/register", async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({
      success: true,
      message: "Registration successful!",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Registration failed.",
      errors: error.messages,
    });
  }
});
```

### How Flash Messages Work

1. **Set**: `req.flash('type', 'message')` stores message in session
2. **Redirect**: User is redirected to another page
3. **Read**: `req.flash('type')` retrieves and **deletes** the message
4. **Display**: Message shown to user once, then gone

```
POST /login (failed) → flash('error', 'Invalid credentials') → redirect('/login')
                                                                      ↓
GET /login ← flash('error') returns ['Invalid credentials'] ← Session cleared
                                                                      ↓
                                                            Display error to user
```

### Flash Message Types (Convention)

| Type      | Usage                              | Bootstrap Class   |
| --------- | ---------------------------------- | ----------------- |
| `success` | Operation completed successfully   | `alert-success`   |
| `error`   | Operation failed or validation error| `alert-danger`   |
| `info`    | Informational message              | `alert-info`      |
| `warning` | Warning or caution message         | `alert-warning`   |

### Complete Setup Example

```javascript
import express from "express";
import session from "express-session";
import flash from "connect-flash";

const app = express();

// Body parser
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

// Flash middleware
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash("success"),
    error: req.flash("error"),
    info: req.flash("info"),
  };
  next();
});

// View engine
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/subscribe", (req, res) => {
  const { email } = req.body;

  if (!email) {
    req.flash("error", "Email is required.");
    return res.redirect("/");
  }

  // Subscribe logic...
  req.flash("success", "Thank you for subscribing!");
  res.redirect("/");
});

app.listen(3000);
```

---

## Debugging Commands

**Run with debugging output**

```bash
DEBUG=* node app.js
# or for specific module
DEBUG=express:* node app.js
```

**Node.js built-in debugger**

```bash
node inspect app.js
```

**Chrome DevTools debugging**

```bash
node --inspect app.js
# Then open chrome://inspect in Chrome
```

---

## Useful NPM Packages

### Development Tools

- `nodemon` - Auto-restart on file changes
- `dotenv` - Environment variable management
- `eslint` - Code linting
- `prettier` - Code formatting
- `jest` - Testing framework
- `supertest` - HTTP testing

### Express Middleware

- `cors` - CORS handling
- `helmet` - Security headers
- `morgan` - HTTP request logger
- `express-validator` - Input validation
- `multer` - File upload handling
- `compression` - Response compression

### Database

- `mongoose` - MongoDB ODM
- `pg` - PostgreSQL client
- `mysql2` - MySQL client
- `sequelize` - SQL ORM

### Authentication

- `jsonwebtoken` - JWT implementation
- `bcrypt` - Password hashing
- `passport` - Authentication middleware

### Utilities

- `lodash` - Utility functions
- `moment` - Date manipulation
- `axios` - HTTP client
- `uuid` - Unique ID generation

---

## Quick Reference Commands

### NPM Commands

```bash
# Project Setup
npm init -y
npm install express
npm install nodemon --save-dev

# Install Dependencies
npm install
npm install <package>
npm install <package>@<version>
npm install <package> -D

# Remove Packages
npm uninstall <package>
npm rm <package>

# Update Packages
npm update
npm update <package>
npm outdated

# Package Management
npm list
npm list -g
npm audit
npm audit fix

# Cache
npm cache clean --force
```

### Running Applications - Older Node.js (< v20.6.0)

```bash
# Basic run
node app.js

# With nodemon (auto-restart)
nodemon app.js

# With dotenv (environment variables)
node -r dotenv/config app.js

# With nodemon + dotenv
nodemon -r dotenv/config app.js

# NPM scripts
npm start
npm run dev
```

### Running Applications - Latest Node.js (v20.6.0+)

```bash
# Basic run
node app.js

# With watch mode (auto-restart)
node --watch index.js

# With environment file
node --env-file=.env index.js

# With watch + environment file (recommended for development)
node --env-file=.env --watch index.js

# With debugging
node --env-file=.env --inspect index.js

# With multiple environment files
node --env-file=.env --env-file=.env.local --watch index.js
```

### Production (All Versions)

```bash
# Set production mode
NODE_ENV=production node app.js

# Using PM2
pm2 start app.js --name "my-app"
pm2 list
pm2 logs
pm2 stop my-app
pm2 restart my-app
```

---

## Conclusion

This guide covers the essential features and commands for Node.js and Express.js development. For more detailed information, visit:

- Node.js Documentation: https://nodejs.org/docs
- Express.js Documentation: https://expressjs.comā
- NPM Documentation: https://docs.npmjs.com
