const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const shortid = require("shortid");

// POST /api/url/shorten
const createShortUrl = async (req, res) => {
  const { original, userId } = req.body; // field from Prisma schema
  const short = shortid.generate(); // also from Prisma schema

  try {
    const newUrl = await prisma.url.create({
      data: {
        original,
        short,
        userId,
      },
    });
    const domain = req.headers.host;
    // const BASE_URL = process.env.BASE_URL || `http://${domain}`;
    const BASE_URL = process.env.BASE_URL || 'https://4f3658621488.ngrok-free.app';

    
    // No need to include /api/url again if your route is like /:short
    res.json({ shortUrl: `${BASE_URL}/${short}` });
    
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/url/:short
// const redirectToOriginalUrl = async (req, res) => {
//   const { short } = req.params;

//   try {
//     const url = await prisma.url.findUnique({
//       where: { short },
//     });

//     if (!url) return res.status(404).json({ error: "URL not found" });

//     await prisma.url.update({
//       where: { short },
//       data: { clickCount: { increment: 1 } },
//     });

//     res.redirect(url.original);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// GET /api/url/analytics/:short
const getUrlAnalytics = async (req, res) => {
  const { short } = req.params;

  try {
    const url = await prisma.url.findUnique({
      where: { short },
    });

    if (!url) return res.status(404).json({ error: "URL not found" });

    res.json({
      originalUrl: url.original,
      clickCount: url.clickCount,
      deviceInfo: url.deviceInfo,
      createdAt: url.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createShortUrl,
  // redirectToOriginalUrl,
  getUrlAnalytics,
};
