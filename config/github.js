import { GitHub } from "arctic";
import { env } from "../validators/env.js";

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
  env.GITHUB_CALLBACK_URL
);
