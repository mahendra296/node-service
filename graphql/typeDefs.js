import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const userSchema = readFileSync(
  join(__dirname, "schemas", "user.graphql"),
  "utf-8"
);

const shortnerSchema = readFileSync(
  join(__dirname, "schemas", "shortner.graphql"),
  "utf-8"
);

export const typeDefs = [userSchema, shortnerSchema];
