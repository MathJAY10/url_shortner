const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  redirectToOriginalUrl,
  getUrlAnalytics,
} = require("../controllers/urlController");

router.post("/shorten", createShortUrl);
// router.get("/:short", redirectToOriginalUrl);
router.get("/analytics/:short", getUrlAnalytics);

module.exports = router;
