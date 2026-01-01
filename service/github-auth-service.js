import { generateState } from "arctic";
import { github } from "../config/github.js";

export const createGithubAuthorizationURL = async () => {
  const state = generateState();
  const scopes = ["user:email"];
  const url = github.createAuthorizationURL(state, scopes);

  return { url, state };
};

export const validateGithubCallback = async (code) => {
  const tokens = await github.validateAuthorizationCode(code);
  return tokens;
};

export const getGitHubUserInfo = async (accessToken) => {
  const response = await fetch(
    "https://api.github.com/user",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Google user info");
  }

  return response.json();
};

export const getGitHubEmails = async (accessToken) => {
  const response = await fetch(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Google user info");
  }

  return response.json();
};