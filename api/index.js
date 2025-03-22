const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const rateLimit = require("express-rate-limit");
const { query, validationResult } = require("express-validator");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet()); // Adds various HTTP headers for security
// app.use(
//   cors({
//     origin: [
//       'https://keevospace.vercel.app',
//       'http://localhost:3000' 
//     ],
//     methods: ["GET"],
//   })
// );
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

/**
 * Fetches metadata from a given URL including title, description, images, and Open Graph data
 * @param {string} url - The URL to fetch metadata from
 * @returns {Promise<Object>} - Object containing the metadata
 */
async function getLinkMetadata(url) {
  try {
    // Fetch the HTML content
    const response = await axios.get(url, {
      timeout: 5000, // 5 second timeout
      maxRedirects: 5, // Maximum number of redirects
      headers: {
        "User-Agent": "Keevo-Link-Preview/1.0",
      },
    });
    const html = response.data;
    const $ = cheerio.load(html);

    // Initialize metadata object
    const metadata = {
      url: url,
      title: "",
      description: "",
      image: "",
      siteName: "",
      type: "",
    };

    // Get Open Graph metadata
    $('meta[property^="og:"]').each((i, element) => {
      const property = $(element).attr("property").replace("og:", "");
      const content = $(element).attr("content");
      metadata[property] = content;
    });

    // Get Twitter Card metadata
    $('meta[name^="twitter:"]').each((i, element) => {
      const name = $(element).attr("name").replace("twitter:", "");
      const content = $(element).attr("content");
      if (!metadata[name]) {
        metadata[name] = content;
      }
    });

    // Fallback to standard HTML metadata if OG tags are not available
    if (!metadata.title) {
      metadata.title = $("title").text() || "";
    }

    if (!metadata.description) {
      metadata.description =
        $('meta[name="description"]').attr("content") || "";
    }

    // Clean up metadata (remove null/undefined values)
    Object.keys(metadata).forEach((key) => {
      if (!metadata[key]) {
        delete metadata[key];
      }
    });

    return metadata;
  } catch (error) {
    console.error("Error fetching metadata:", error.message);
    throw error;
  }
}

// URL validation middleware
const validateUrl = [
  query("url")
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
    })
    .withMessage("Invalid URL format. URL must start with http:// or https://"),
];

// API route for link preview
app.get("/api/preview", validateUrl, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url } = req.query;
    const metadata = await getLinkMetadata(url);
    res.json(metadata);
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({
      error: "Failed to fetch link preview",
      message: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = {
  getLinkMetadata,
};
