const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const authRoutes = require("./routes/auth");
const urlRoutes = require("./routes/url");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// ✅ CORS middleware setup
app.use(
  cors({
    origin: [
      "http://localhost:5173", // dev frontend
      "https://urlshortner-production-09e1.up.railway.app", // prod backend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ JSON middleware
app.use(express.json());

// ✅ Log route load
console.log("Loaded authRoutes:", typeof authRoutes);

// ✅ Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

// ✅ Dynamic redirection route
app.get("/:short", async (req, res) => {
  const { short } = req.params;

  try {
    const url = await prisma.url.findUnique({
      where: { short },
    });

    if (!url) return res.status(404).send("Short URL not found");

    await prisma.url.update({
      where: { short },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });

    return res.redirect(url.original);
  } catch (err) {
    console.error("Redirect error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// ✅ Start server AFTER all routes
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
