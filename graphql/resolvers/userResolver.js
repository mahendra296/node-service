import { db } from "../../config/db.js";
import { usersTable } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";
import {
  getUserById,
  getUserByEmail,
  createUser as createUserService,
} from "../../service/user-service.js";
import {
  getSessionsByUserId,
  updateUserProfile,
} from "../../service/profile-service.js";
import { hashPassword } from "../../service/auth-service.js";
import { getAllShortLinks } from "../../model/shortnerModelMySQL.js";
import { GraphQLError } from "graphql";

export const userResolvers = {
  Query: {
    getAllUsers: async () => {
      const users = await db.select().from(usersTable);
      return users;
    },

    getUserById: async (_, { id }) => {
      const user = await getUserById(id);
      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return user;
    },

    getUserByEmail: async (_, { email }) => {
      const user = await getUserByEmail(email);
      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return user;
    },

    getUserSessionsById: async (_, { userId }) => {
      const sessions = await getSessionsByUserId(userId);
      return sessions;
    },
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const { firstName, lastName, email, password, phone, countryCode, gender } = input;

      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        throw new GraphQLError("User with this email already exists", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const [result] = await createUserService({
        firstName,
        lastName,
        gender,
        email,
        countryCode,
        phone,
        password: hashedPassword,
      });

      // Fetch and return the created user
      const newUser = await getUserById(result.id);
      return newUser;
    },

    updateUser: async (_, { id, input }) => {
      const { firstName, lastName, phone, countryCode, gender } = input;

      // Check if user exists
      const existingUser = await getUserById(id);
      if (!existingUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Update user profile
      await updateUserProfile(id, {
        firstName: firstName ?? existingUser.firstName,
        lastName: lastName ?? existingUser.lastName,
        gender,
        countryCode,
        phone,
      });

      // Return updated user
      const updatedUser = await getUserById(id);
      return updatedUser;
    },

    deleteUser: async (_, { id }) => {
      // Check if user exists
      const existingUser = await getUserById(id);
      if (!existingUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Delete user
      await db.delete(usersTable).where(eq(usersTable.id, id));
      return true;
    },
  },

  User: {
    shortLinks: async (parent) => {
      const links = await getAllShortLinks(parent.id);
      return links;
    },
  },
};
