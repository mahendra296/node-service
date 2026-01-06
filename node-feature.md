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
   - [CORS](#cors---detailed-guide)
   - [Helmet](#helmet---detailed-guide)
   - [Cookie Parser](#cookie-parser---detailed-guide)
   - [Express Session](#express-session---detailed-guide)
   - [Connect Flash](#connect-flash---detailed-guide)
8. [Logging](#logging---detailed-guide)
   - [Morgan (HTTP Logger)](#morgan---http-request-logger)
   - [Winston (Application Logger)](#winston---application-logger)
9. [Best Practices](#best-practices)

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

## CORS - Detailed Guide

The `cors` package provides a middleware to enable Cross-Origin Resource Sharing (CORS) in Express applications. CORS allows your server to accept requests from different domains/origins.

### What is CORS?

When a web application makes a request to a different domain (origin), the browser blocks it by default for security. CORS headers tell the browser which origins are allowed to access your API.

```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
→ Browser blocks this by default (different ports = different origins)
→ CORS middleware allows you to permit these cross-origin requests
```

### Installation

```bash
npm install cors
```

### Import & Setup

```javascript
// ES Module (recommended for modern Node.js)
import cors from "cors";

// CommonJS
const cors = require("cors");

// Basic setup - allows all origins (not recommended for production)
app.use(cors());
```

### Configuration Options

**Allow All Origins (Development)**

```javascript
// Allow requests from any origin
app.use(cors());
```

**Allow Specific Origin**

```javascript
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
```

**Allow Multiple Origins**

```javascript
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "https://myapp.com"],
  })
);
```

**Dynamic Origin (Whitelist)**

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "https://myapp.com",
  "https://admin.myapp.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
```

**Full Configuration Example**

```javascript
app.use(
  cors({
    // Allowed origins
    origin: ["http://localhost:3000", "https://myapp.com"],

    // Allowed HTTP methods
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

    // Allowed headers
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],

    // Headers exposed to the client
    exposedHeaders: ["X-Total-Count", "X-Page-Count"],

    // Allow credentials (cookies, authorization headers)
    credentials: true,

    // Cache preflight request results (in seconds)
    maxAge: 86400, // 24 hours

    // Success status for legacy browsers
    optionsSuccessStatus: 200,
  })
);
```

### Common Use Cases

**Enable CORS for Specific Routes Only**

```javascript
import cors from "cors";

// CORS only for API routes
app.use("/api", cors());

// Or for specific route
app.get("/api/public", cors(), (req, res) => {
  res.json({ message: "This route allows CORS" });
});
```

**Different CORS Config for Different Routes**

```javascript
const publicCors = cors({
  origin: "*",
});

const privateCors = cors({
  origin: "https://admin.myapp.com",
  credentials: true,
});

app.use("/api/public", publicCors);
app.use("/api/admin", privateCors);
```

**Handle Credentials (Cookies/Auth Headers)**

```javascript
// Backend
app.use(
  cors({
    origin: "http://localhost:3000", // Must be specific origin, not '*'
    credentials: true,
  })
);

// Frontend (fetch)
fetch("http://localhost:5000/api/data", {
  credentials: "include", // Include cookies
});

// Frontend (axios)
axios.get("http://localhost:5000/api/data", {
  withCredentials: true,
});
```

### CORS Options Reference

| Option               | Description                                                    | Default     |
| -------------------- | -------------------------------------------------------------- | ----------- |
| `origin`             | Allowed origin(s) - string, array, regex, or function          | `*`         |
| `methods`            | Allowed HTTP methods                                           | `GET,HEAD,PUT,PATCH,POST,DELETE` |
| `allowedHeaders`     | Headers the client can send                                    | Reflect request headers |
| `exposedHeaders`     | Headers exposed to the client                                  | None        |
| `credentials`        | Allow credentials (cookies, auth headers)                      | `false`     |
| `maxAge`             | Preflight cache duration (seconds)                             | None        |
| `preflightContinue`  | Pass preflight response to next handler                        | `false`     |
| `optionsSuccessStatus` | Status code for successful OPTIONS requests                  | `204`       |

### Environment-Based Configuration

```javascript
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://myapp.com", "https://www.myapp.com"]
      : ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
```

### Handling CORS Errors

```javascript
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:3000"];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
  })
);

// Error handler for CORS errors
app.use((err, req, res, next) => {
  if (err.message.includes("CORS")) {
    res.status(403).json({
      error: "CORS Error",
      message: "This origin is not allowed to access this resource",
    });
  } else {
    next(err);
  }
});
```

---

## Helmet - Detailed Guide

The `helmet` package helps secure Express apps by setting various HTTP headers. It's a collection of 15 smaller middleware functions that set security-related HTTP response headers.

### Why Use Helmet?

HTTP headers can expose your app to vulnerabilities. Helmet sets headers that:

- Prevent clickjacking attacks
- Disable browser features that could be exploited
- Prevent MIME type sniffing
- Add XSS protection
- Control DNS prefetching
- And more...

### Installation

```bash
npm install helmet
```

### Import & Setup

```javascript
// ES Module (recommended for modern Node.js)
import helmet from "helmet";

// CommonJS
const helmet = require("helmet");

// Basic setup - enables all default protections
app.use(helmet());
```

### What Helmet Sets by Default

When you use `helmet()`, it enables these middleware by default:

| Middleware                | Header Set                           | Protection                           |
| ------------------------- | ------------------------------------ | ------------------------------------ |
| `contentSecurityPolicy`   | `Content-Security-Policy`            | Prevents XSS attacks                 |
| `crossOriginEmbedderPolicy` | `Cross-Origin-Embedder-Policy`     | Controls resource loading            |
| `crossOriginOpenerPolicy` | `Cross-Origin-Opener-Policy`         | Isolates browsing context            |
| `crossOriginResourcePolicy` | `Cross-Origin-Resource-Policy`     | Controls resource sharing            |
| `dnsPrefetchControl`      | `X-DNS-Prefetch-Control`             | Controls DNS prefetching             |
| `frameguard`              | `X-Frame-Options`                    | Prevents clickjacking                |
| `hidePoweredBy`           | Removes `X-Powered-By`               | Hides Express identifier             |
| `hsts`                    | `Strict-Transport-Security`          | Enforces HTTPS                       |
| `ieNoOpen`                | `X-Download-Options`                 | IE8+ security                        |
| `noSniff`                 | `X-Content-Type-Options`             | Prevents MIME sniffing               |
| `originAgentCluster`      | `Origin-Agent-Cluster`               | Process isolation                    |
| `permittedCrossDomainPolicies` | `X-Permitted-Cross-Domain-Policies` | Adobe Flash/PDF security          |
| `referrerPolicy`          | `Referrer-Policy`                    | Controls referrer information        |
| `xssFilter`               | `X-XSS-Protection`                   | XSS filter (legacy browsers)         |

### Configuration Options

**Disable Specific Middleware**

```javascript
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP
    crossOriginEmbedderPolicy: false, // Disable COEP
  })
);
```

**Custom Content Security Policy**

```javascript
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.myapp.com"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);
```

**Configure Frame Options (Clickjacking Protection)**

```javascript
app.use(
  helmet({
    frameguard: {
      action: "deny", // Options: 'deny', 'sameorigin', or 'allow-from'
    },
  })
);
```

**Configure HSTS (HTTPS Enforcement)**

```javascript
app.use(
  helmet({
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
  })
);
```

**Configure Referrer Policy**

```javascript
app.use(
  helmet({
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
      // Options: 'no-referrer', 'no-referrer-when-downgrade',
      // 'origin', 'origin-when-cross-origin', 'same-origin',
      // 'strict-origin', 'strict-origin-when-cross-origin', 'unsafe-url'
    },
  })
);
```

### Full Configuration Example

```javascript
app.use(
  helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trusted-cdn.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", process.env.API_URL],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },

    // Cross-Origin policies
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },

    // DNS Prefetch Control
    dnsPrefetchControl: { allow: false },

    // Frameguard (clickjacking protection)
    frameguard: { action: "deny" },

    // Hide X-Powered-By header
    hidePoweredBy: true,

    // HSTS
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },

    // IE No Open
    ieNoOpen: true,

    // No Sniff
    noSniff: true,

    // Referrer Policy
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },

    // XSS Filter
    xssFilter: true,
  })
);
```

### Using Individual Middleware

You can use Helmet's middleware functions individually:

```javascript
import helmet from "helmet";

// Only use specific middleware
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.noSniff());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
```

### Common CSP Directives Reference

| Directive         | Description                                    | Example Values                    |
| ----------------- | ---------------------------------------------- | --------------------------------- |
| `defaultSrc`      | Fallback for other directives                  | `'self'`, `'none'`                |
| `scriptSrc`       | Valid sources for JavaScript                   | `'self'`, `'unsafe-inline'`, URLs |
| `styleSrc`        | Valid sources for stylesheets                  | `'self'`, `'unsafe-inline'`, URLs |
| `imgSrc`          | Valid sources for images                       | `'self'`, `data:`, `https:`       |
| `connectSrc`      | Valid sources for fetch, WebSocket, etc.       | `'self'`, API URLs                |
| `fontSrc`         | Valid sources for fonts                        | `'self'`, font CDN URLs           |
| `objectSrc`       | Valid sources for `<object>`, `<embed>`        | `'none'`                          |
| `mediaSrc`        | Valid sources for `<audio>`, `<video>`         | `'self'`                          |
| `frameSrc`        | Valid sources for `<frame>`, `<iframe>`        | `'none'`, `'self'`                |
| `workerSrc`       | Valid sources for workers                      | `'self'`                          |
| `formAction`      | Valid targets for form submissions             | `'self'`                          |

### Environment-Based Configuration

```javascript
const helmetConfig =
  process.env.NODE_ENV === "production"
    ? {
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
          },
        },
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        },
      }
    : {
        // More relaxed settings for development
        contentSecurityPolicy: false,
        hsts: false,
      };

app.use(helmet(helmetConfig));
```

### Helmet + CORS Complete Security Setup

```javascript
import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Body parser
app.use(express.json());

// Your routes here
app.get("/api/data", (req, res) => {
  res.json({ message: "Secure API response" });
});

app.listen(3000);
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

## Logging - Detailed Guide

Logging is essential for debugging, monitoring, and maintaining Node.js applications. This guide covers two popular packages: **Morgan** for HTTP request logging and **Winston** for application-level logging.

### Why Logging is Important

- **Debugging**: Track down bugs and issues in production
- **Monitoring**: Monitor application health and performance
- **Security**: Track suspicious activities and access patterns
- **Auditing**: Maintain records of user actions and system events
- **Analytics**: Understand usage patterns and user behavior

---

### Morgan - HTTP Request Logger

Morgan is an HTTP request logger middleware for Node.js. It logs details about incoming requests.

#### Installation

```bash
npm install morgan
```

#### Import & Setup

```javascript
// ES Module (recommended for modern Node.js)
import morgan from "morgan";

// CommonJS
const morgan = require("morgan");

// Basic setup
app.use(morgan("dev"));
```

#### Predefined Formats

Morgan comes with several predefined log formats:

| Format     | Output                                                                           |
| ---------- | -------------------------------------------------------------------------------- |
| `combined` | Apache combined log format                                                       |
| `common`   | Apache common log format                                                         |
| `dev`      | Colorful output for development: `:method :url :status :response-time ms`        |
| `short`    | Shorter than default: `:remote-addr :method :url :status :response-time ms`      |
| `tiny`     | Minimal: `:method :url :status :res[content-length] - :response-time ms`         |

```javascript
// Development - colorful, concise
app.use(morgan("dev"));

// Production - detailed Apache-style logs
app.use(morgan("combined"));

// Minimal logging
app.use(morgan("tiny"));
```

#### Custom Format

```javascript
// Custom format string
app.use(morgan(":method :url :status :response-time ms - :res[content-length]"));

// Custom format with function
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);
```

#### Custom Tokens

```javascript
// Define custom token
morgan.token("user-id", (req) => req.user?.id || "anonymous");
morgan.token("client-ip", (req) => req.ip || req.connection.remoteAddress);

// Use custom tokens in format
app.use(morgan(":client-ip :user-id :method :url :status :response-time ms"));
```

#### Write to File

```javascript
import fs from "fs";
import path from "path";

// Create write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs", "access.log"),
  { flags: "a" } // Append mode
);

// Log to file
app.use(morgan("combined", { stream: accessLogStream }));

// Log to both console and file
app.use(morgan("dev")); // Console
app.use(morgan("combined", { stream: accessLogStream })); // File
```

#### Skip Logging for Certain Requests

```javascript
app.use(
  morgan("dev", {
    // Skip logging for static assets
    skip: (req, res) => {
      const staticExtensions = [".css", ".js", ".png", ".jpg", ".ico"];
      return staticExtensions.some((ext) => req.url.endsWith(ext));
    },
  })
);

// Skip successful requests (only log errors)
app.use(
  morgan("combined", {
    skip: (req, res) => res.statusCode < 400,
  })
);
```

#### Morgan Tokens Reference

| Token               | Description                          |
| ------------------- | ------------------------------------ |
| `:method`           | HTTP method (GET, POST, etc.)        |
| `:url`              | Request URL                          |
| `:status`           | Response status code                 |
| `:response-time`    | Response time in milliseconds        |
| `:date`             | Date in various formats              |
| `:http-version`     | HTTP version                         |
| `:referrer`         | Referrer header                      |
| `:remote-addr`      | Remote IP address                    |
| `:remote-user`      | User from basic auth                 |
| `:user-agent`       | User-Agent header                    |
| `:res[header]`      | Response header value                |
| `:req[header]`      | Request header value                 |

---

### Winston - Application Logger

Winston is a versatile logging library with support for multiple transports (destinations), log levels, and formatting options.

#### Installation

```bash
npm install winston
```

#### Import & Basic Setup

```javascript
// ES Module
import winston from "winston";

// CommonJS
const winston = require("winston");

// Create logger with default settings
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
```

#### Log Levels

Winston uses npm log levels by default (lowest to highest priority):

| Level   | Priority | Usage                                   |
| ------- | -------- | --------------------------------------- |
| `error` | 0        | Error events, application failures      |
| `warn`  | 1        | Warning conditions                      |
| `info`  | 2        | Informational messages                  |
| `http`  | 3        | HTTP request logging                    |
| `verbose`| 4       | Verbose information                     |
| `debug` | 5        | Debug information                       |
| `silly` | 6        | Most verbose, everything                |

```javascript
// Log at different levels
logger.error("Database connection failed");
logger.warn("API rate limit approaching");
logger.info("Server started on port 3000");
logger.http("GET /api/users 200 15ms");
logger.debug("Processing user data", { userId: 123 });
```

#### Formats

Winston provides various formatting options:

```javascript
const { format } = winston;

// JSON format
const jsonFormat = format.json();

// Simple text format
const simpleFormat = format.simple();

// Pretty print
const prettyFormat = format.prettyPrint();

// Colorized console output
const colorFormat = format.combine(format.colorize(), format.simple());

// Custom format with timestamp
const customFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, stack, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (stack) msg += `\n${stack}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);
```

#### Transports

Transports define where logs are sent:

```javascript
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // File transport - all logs
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // File transport - errors only
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});
```

#### Complete Logger Configuration

```javascript
import winston from "winston";
import path from "path";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true })
  ),
  transports: [
    // Console - colorful for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ""
          }`;
        })
      ),
    }),

    // Error log file
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
      format: winston.format.json(),
      maxsize: 5242880,
      maxFiles: 5,
    }),

    // Combined log file
    new winston.transports.File({
      filename: path.join("logs", "combined.log"),
      format: winston.format.json(),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
});

export default logger;
```

#### Using the Logger

```javascript
import logger from "./utils/logger.js";

// Basic logging
logger.info("Application started");
logger.error("Failed to connect to database");
logger.warn("API rate limit warning");
logger.debug("Debug information", { data: someData });

// Logging with metadata
logger.info("User logged in", { userId: 123, ip: "192.168.1.1" });
logger.error("Request failed", { error: err.message, stack: err.stack });

// Logging errors
try {
  await someOperation();
} catch (error) {
  logger.error("Operation failed", {
    message: error.message,
    stack: error.stack,
  });
}
```

#### Helper Methods for Structured Logging

```javascript
// Add to your logger file
logger.logRequest = (req, message = "Incoming request") => {
  logger.http(message, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
};

logger.logError = (error, req = null) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    name: error.name,
  };
  if (req) {
    errorInfo.method = req.method;
    errorInfo.url = req.originalUrl;
    errorInfo.ip = req.ip;
  }
  logger.error("Error occurred", errorInfo);
};

logger.logAuth = (action, userId = null, details = {}) => {
  logger.info(`Auth: ${action}`, { userId, ...details });
};
```

---

### Integrating Morgan with Winston

Combine Morgan's HTTP logging with Winston for unified logging:

```javascript
import express from "express";
import morgan from "morgan";
import winston from "winston";

const app = express();

// Create Winston logger
const logger = winston.createLogger({
  level: "http",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/http.log" }),
  ],
});

// Create stream for Morgan to use Winston
logger.stream = {
  write: (message) => logger.http(message.trim()),
};

// Use Morgan with Winston stream
app.use(
  morgan(":method :url :status :response-time ms", {
    stream: logger.stream,
  })
);
```

---

### Environment-Based Logging Configuration

```javascript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  silent: process.env.NODE_ENV === "test", // Disable logging in tests
  format: winston.format.combine(
    winston.format.timestamp(),
    process.env.NODE_ENV === "production"
      ? winston.format.json()
      : winston.format.combine(winston.format.colorize(), winston.format.simple())
  ),
  transports: [
    new winston.transports.Console(),
    // Only add file transports in production
    ...(process.env.NODE_ENV === "production"
      ? [
          new winston.transports.File({ filename: "logs/error.log", level: "error" }),
          new winston.transports.File({ filename: "logs/combined.log" }),
        ]
      : []),
  ],
});
```

---

### Logging Best Practices

1. **Use appropriate log levels**
   - `error`: Application errors that need immediate attention
   - `warn`: Potential issues that should be investigated
   - `info`: General application flow and important events
   - `debug`: Detailed information for debugging

2. **Include context in logs**
   ```javascript
   // Good
   logger.error("Failed to process order", { orderId: 123, userId: 456, error: err.message });

   // Bad
   logger.error("Error occurred");
   ```

3. **Don't log sensitive data**
   ```javascript
   // Bad - logs password
   logger.info("User login", { email, password });

   // Good - redact sensitive info
   logger.info("User login", { email, password: "[REDACTED]" });
   ```

4. **Use structured logging in production**
   ```javascript
   // JSON format is easier to parse and analyze
   logger.info("Request processed", {
     method: "POST",
     path: "/api/orders",
     statusCode: 201,
     responseTime: 45,
   });
   ```

5. **Implement log rotation**
   ```javascript
   new winston.transports.File({
     filename: "logs/app.log",
     maxsize: 5242880, // 5MB
     maxFiles: 5,      // Keep 5 rotated files
   })
   ```

6. **Handle uncaught exceptions and rejections**
   ```javascript
   logger.exceptions.handle(
     new winston.transports.File({ filename: "logs/exceptions.log" })
   );
   ```

---

### Complete Example: Express App with Logging

```javascript
import express from "express";
import morgan from "morgan";
import winston from "winston";
import path from "path";

const app = express();

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "my-app" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length > 1 ? JSON.stringify(meta) : ""
          }`;
        })
      ),
    }),
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join("logs", "combined.log"),
    }),
  ],
});

// Create stream for Morgan
logger.stream = {
  write: (message) => logger.http(message.trim()),
};

// HTTP request logging with Morgan
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length]", {
    stream: logger.stream,
  })
);

// Body parser
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  logger.info("Home page accessed");
  res.send("Hello World!");
});

app.post("/api/users", (req, res) => {
  logger.info("Creating new user", { email: req.body.email });
  // ... create user logic
  res.status(201).json({ message: "User created" });
});

// Error handler with logging
app.use((err, req, res, next) => {
  logger.error("Error occurred", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
});
```

---

### Log Output Examples

**Console Output (Development)**:
```
2024-01-15 10:30:45 [info]: Server started on port 3000
2024-01-15 10:30:46 [http]: GET / 200 5.234 ms
2024-01-15 10:30:47 [info]: User logged in {"userId":123}
2024-01-15 10:30:48 [error]: Database connection failed {"error":"ECONNREFUSED"}
```

**JSON Output (Production - combined.log)**:
```json
{"level":"info","message":"Server started on port 3000","timestamp":"2024-01-15T10:30:45.000Z","service":"my-app"}
{"level":"http","message":"GET / 200 5.234 ms","timestamp":"2024-01-15T10:30:46.000Z","service":"my-app"}
{"level":"info","message":"User logged in","userId":123,"timestamp":"2024-01-15T10:30:47.000Z","service":"my-app"}
{"level":"error","message":"Database connection failed","error":"ECONNREFUSED","timestamp":"2024-01-15T10:30:48.000Z","service":"my-app"}
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
- Express.js Documentation: https://expressjs.com
- NPM Documentation: https://docs.npmjs.com
