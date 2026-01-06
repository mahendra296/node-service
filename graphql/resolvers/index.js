import { userResolvers } from "./userResolver.js";
import { shortnerResolvers } from "./shortnerResolver.js";

// Custom DateTime scalar
const dateTimeScalar = {
  DateTime: {
    serialize(value) {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    },
    parseValue(value) {
      return new Date(value);
    },
    parseLiteral(ast) {
      if (ast.kind === "StringValue") {
        return new Date(ast.value);
      }
      return null;
    },
  },
};

// Merge all resolvers
export const resolvers = {
  ...dateTimeScalar,
  Query: {
    ...userResolvers.Query,
    ...shortnerResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...shortnerResolvers.Mutation,
  },
  User: userResolvers.User,
  ShortLink: shortnerResolvers.ShortLink,
};
