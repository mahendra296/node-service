import { db } from "../../config/db.js";
import { shortLinkTable } from "../../drizzle/schema.js";
import {
  getAllShortLinks,
  saveLinks,
  getLinkByShortCode,
} from "../../model/shortnerModelMySQL.js";
import { getUserById } from "../../service/user-service.js";
import { GraphQLError } from "graphql";
import crypto from "crypto";

const generateShortCode = () => {
  return crypto.randomBytes(4).toString("hex");
};

export const shortnerResolvers = {
  Query: {
    getAllShortnerLinks: async () => {
      const links = await db.select().from(shortLinkTable);
      return links;
    },

    getShortnerLinkByUserId: async (_, { userId }) => {
      const links = await getAllShortLinks(userId);
      return links;
    },
  },

  Mutation: {
    createShortnerLink: async (_, { input }) => {
      const { url, shortCode, userId } = input;

      // Verify user exists
      const user = await getUserById(userId);
      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Generate or use provided short code
      let finalShortCode = shortCode || generateShortCode();

      // Check if short code already exists
      const existingLink = await getLinkByShortCode(finalShortCode);
      if (existingLink) {
        throw new GraphQLError("Short code already exists", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // Create the short link
      await saveLinks({
        url,
        finalShortCode,
        userId,
      });

      // Fetch and return the created link
      const newLink = await getLinkByShortCode(finalShortCode);
      return newLink;
    },
  },

  ShortLink: {
    user: async (parent) => {
      const user = await getUserById(parent.userId);
      return user;
    },
  },
};
