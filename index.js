import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import requestIp from "request-ip";
import http from "http";
import { ApolloServer, HeaderMap } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { shortenRouter } from "./routes/page.routes.js";
import { verifyAuthToken } from "./middlewares/verify-auth-middleware.js";
import { loadSessionsIntoCache } from "./service/auth-service.js";
import { getUserById } from "./service/user-service.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers/index.js";

const app = express();

// parse cookies
app.use(cookieParser());

// session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

// Get Ip address for user request
app.use(requestIp.mw());

// Serve static files before auth check (CSS, JS, images don't need authentication)
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// verify auth token for each request
app.use(verifyAuthToken);

app.use(async (req, res, next) => {
  if (req.user?.id) {
    // Fetch profile image for authenticated users
    const fullUser = await getUserById(req.user.id);
    res.locals.user = {
      ...req.user,
      profileImage: fullUser?.profileImage || null,
    };
  } else {
    res.locals.user = req.user;
  }
  return next();
});
app.set("view engine", "ejs");

app.use(shortenRouter);

const PORT = process.env.PORT || 3000;

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Apollo Server with drain plugin for graceful shutdown
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Express middleware for Apollo Server 5
const apolloExpressMiddleware = (server) => {
  return async (req, res, next) => {
    try {
      const headers = new HeaderMap();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value !== undefined) {
          headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        }
      }

      const httpGraphQLRequest = {
        method: req.method.toUpperCase(),
        headers,
        search: req.url.includes("?") ? req.url.split("?")[1] : "",
        body: req.body,
      };

      const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
        httpGraphQLRequest,
        context: async () => ({
          req,
          res,
          user: req.user,
        }),
      });

      for (const [key, value] of httpGraphQLResponse.headers) {
        res.setHeader(key, value);
      }

      res.status(httpGraphQLResponse.status || 200);

      if (httpGraphQLResponse.body.kind === "complete") {
        res.send(httpGraphQLResponse.body.string);
        return;
      }

      for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
        res.write(chunk);
      }
      res.end();
    } catch (error) {
      next(error);
    }
  };
};

// Start function to initialize Apollo Server and Express
const startServer = async () => {
  try {
    // Load active sessions into cache
    await loadSessionsIntoCache();

    // Start Apollo Server
    await apolloServer.start();

    // Add GraphQL middleware
    app.use("/graphql", apolloExpressMiddleware(apolloServer));

    // 404 handler - must be after all other routes including GraphQL
    app.use(notFoundHandler);

    // Global error handler - must be last
    app.use(errorHandler);

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
