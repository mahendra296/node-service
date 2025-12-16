import { db } from "../config/db.js";
import { shortLinkTable } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

export const getAllShortLinks = async (userId) => {
  try {
    const allShortLinks = await db
      .select()
      .from(shortLinkTable)
      .where(eq(shortLinkTable.userId, userId));
    return allShortLinks;
  } catch (err) {
    throw err;
  }
};

export const saveLinks = async ({ url, finalShortCode, userId }) => {
  const result = db
    .insert(shortLinkTable)
    .values({ shortCode: finalShortCode, url: url, userId: userId });

  return result;
};

export const getLinkByShortCode = async (shortCode) => {
  const [shortLink] = await db
    .select()
    .from(shortLinkTable)
    .where(eq(shortLinkTable.shortCode, shortCode));

  return shortLink;
};

export const deleteLink = async (shortCodeId) => {
  const result = await db
    .delete(shortLinkTable)
    .where(eq(shortLinkTable.id, shortCodeId));
  return result;
};

export const getLinkById = async (id) => {
  const [shortLink] = await db
    .select()
    .from(shortLinkTable)
    .where(eq(shortLinkTable.id, id));
  return shortLink;
};

export const updateLink = async (id, { url, shortCode }) => {
  const result = await db
    .update(shortLinkTable)
    .set({ url, shortCode })
    .where(eq(shortLinkTable.id, id));
  return result;
};
