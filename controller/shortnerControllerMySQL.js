import crypto from "crypto";
import {
  getAllShortLinks,
  saveLinks,
  deleteLink,
  getLinkByShortCode,
  getLinkById,
  updateLink,
} from "../model/shortnerModelMySQL.js";
import {
  validateShortner,
  validateShortnerUpdate,
} from "../validators/shortner-validator.js";

export const getShortnerPage = async (req, res) => {
  try {
    console.log("Request recived in DB");
    const links = await getAllShortLinks(req.user.id);

    // Get success or error from query parameters
    const success = req.flash("shornerSuccess") || null;
    const error = req.flash("shornerError") || null;

    return res.render("shortner", { links, host: req.host, success, error });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error.");
  }
};

export const postShortner = async (req, res) => {
  try {
    const { url, shortCode } = req.body;
    console.log(`Url : ${url} and shortCode : ${shortCode}`);

    // Validate input
    const validation = validateShortner({ url, shortCode });
    if (!validation.success) {
      const links = await getAllShortLinks(req.user.id);
      const errorMessage =
        validation.error.errors?.[0]?.message ||
        validation.error.issues?.[0]?.message ||
        "Validation failed";
      return res.status(400).render("shortner", {
        links,
        error: errorMessage,
        formData: { url, shortCode },
        host: req.host,
      });
    }

    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");
    const link = await getLinkByShortCode(finalShortCode);

    if (link) {
      const links = await getAllShortLinks(req.user.id);
      return res.status(400).render("shortner", {
        links,
        error: "Short code already present. Please choose another.",
        formData: { url, shortCode },
        host: req.host,
      });
    }

    await saveLinks({ url, finalShortCode, userId: req.user.id });
    const links = await getAllShortLinks(req.user.id);

    return res.render("shortner", {
      links,
      success: `URL shortened successfully! Your short code is: ${finalShortCode}`,
      host: req.host,
    });
  } catch (error) {
    console.error(error);
    const links = await getAllShortLinks(req.user.id);
    return res.status(500).render("shortner", {
      links,
      error: "Internal server error.",
      formData: { url: req.body.url, shortCode: req.body.shortCode },
      host: req.host,
    });
  }
};

export const redirectToShortLinks = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const link = await getLinkByShortCode(shortCode);

    if (!link) {
      return res.status(404).render("404");
    }

    return res.redirect(link.url);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error.");
  }
};

export const deleteShortLink = async (req, res) => {
  try {
    const { shortCodeId } = req.params;
    const deleted = await deleteLink(shortCodeId);

    if (deleted) {
      req.flash("shornerSuccess", `Short link deleted successfully!`);
      return res.redirect("/shortner");
    } else {
      req.flash("shornerError", "Short code not found.");
      return res.redirect("/shortner");
    }
  } catch (error) {
    console.error(error);
    req.flash("shornerError", "Error deleting short link.");
    return res.redirect("/shortner");
  }
};

export const getEditPage = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await getLinkById(parseInt(id));

    if (!link) {
      req.flash("shornerError", "Short link not found.");
      return res.redirect("/shortner");
    }

    // Verify ownership
    if (link.userId !== req.user.id) {
      req.flash("shornerError", "You are not authorized to edit this link.");
      return res.redirect("/shortner");
    }

    return res.render("edit-shortner", {
      link,
      host: req.host,
      error: req.query.error || null,
    });
  } catch (error) {
    console.error(error);
    req.flash("shornerError", "Error loading edit page.");
    return res.redirect("/shortner");
  }
};

export const postEditShortLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, shortCode } = req.body;

    const link = await getLinkById(parseInt(id));

    if (!link) {
      req.flash("shornerError", "Short link not found.");
      return res.redirect("/shortner");
    }

    // Verify ownership
    if (link.userId !== req.user.id) {
      req.flash("shornerError", "You are not authorized to edit this link.");
      return res.redirect("/shortner");
    }

    // Validate input
    const validation = validateShortnerUpdate({ url, shortCode });
    if (!validation.success) {
      const errorMessage =
        validation.error.errors[0]?.message || "Invalid input";
      return res.render("edit-shortner", {
        link: { ...link, url, shortCode },
        host: req.host,
        error: errorMessage,
      });
    }

    // Check if new shortCode conflicts with existing one (excluding current link)
    if (shortCode !== link.shortCode) {
      const existingLink = await getLinkByShortCode(shortCode);
      if (existingLink) {
        return res.render("edit-shortner", {
          link: { ...link, url, shortCode },
          host: req.host,
          error: "Short code already in use. Please choose another.",
        });
      }
    }

    await updateLink(parseInt(id), { url, shortCode });
    req.flash(
      "shornerSuccess",
      `Short link "${shortCode}" updated successfully!`
    );
    return res.redirect("/shortner");
  } catch (error) {
    console.error(error);
    req.flash("shornerError", "Error updating short link.");
    return res.redirect("/shortner");
  }
};
