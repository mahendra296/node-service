import { generateCodeVerifier, generateState } from "arctic";
import { google } from "../config/google.js";

export const createGoogleAuthorizationURL = async () => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const scopes = ["openid", "profile", "email"];
  const url = google.createAuthorizationURL(state, codeVerifier, scopes);

  return { url, state, codeVerifier };
};

export const validateGoogleCallback = async (code, codeVerifier) => {
  const tokens = await google.validateAuthorizationCode(code, codeVerifier);
  return tokens;
};

export const getGoogleUserInfo = async (accessToken) => {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
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
