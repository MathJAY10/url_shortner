const express = require("express");

const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const urlRoutes = require("./routes/url");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
dotenv.config();

const app = express();
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://urlshortner-production-09e1.up.railway.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());

// Test the router load
console.log("Loaded authRoutes:", typeof authRoutes); // should log "function"

app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ⬇️ This must come AFTER your other middlewares and routes
app.get('/:short', async (req, res) => {
  const { short } = req.params;

  try {
    const url = await prisma.url.findUnique({
      where: { short },
    });

    if (!url) return res.status(404).send("Short URL not found");

    await prisma.url.update({
      where: { short },
      data: { clickCount: { increment: 1 } },
    });

    return res.redirect(url.original);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
});
