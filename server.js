const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { ytdown, ndown, tikdown, twitterdown } = require("nayan-media-downloaders");

const app = express();
app.use(cors());
app.use(express.static("public"));

app.get("/api/download", async (req, res) => {
  const url = req.query.url;

  try {
    if (!url) return res.status(400).json({ error: "No URL provided" });

    let videoUrl, title;

    if (url.includes("facebook.com") || url.includes("fb.watch")) {
      const response = await ndown(url);
      videoUrl = response.data[0].url;
      title = "Facebook Video";
    } else if (url.includes("tiktok.com")) {
      const response = await tikdown(url);
      videoUrl = response.data.video;
      title = response.data.title;
    } else if (url.includes("instagram.com")) {
      const response = await ndown(url);
      videoUrl = response.data[0].url;
      title = "Instagram Video";
    } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const response = await ytdown(url);
      videoUrl = response.data.video;
      title = response.data.title;
    } else if (url.includes("twitter.com")) {
      const response = await twitterdown(url);
      videoUrl = response.data.HD;
      title = "Twitter Video";
    } else {
      return res.status(400).json({ error: "Unsupported URL" });
    }

    return res.json({ videoUrl, title });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Download failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
