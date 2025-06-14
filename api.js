import axios from "axios";
import fs from "fs";
import { ytdown, ndown, tikdown, twitterdown } from "nayan-media-downloaders";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: "No URL provided" });

  try {
    if (url.includes("facebook.com") || url.includes("fb.watch")) {
      const result = await ndown(url);
      return res.json({ platform: "facebook", video: result.data[0].url });
    }

    if (url.includes("tiktok.com")) {
      const result = await tikdown(url);
      return res.json({ platform: "tiktok", video: result.data.video });
    }

    if (url.includes("instagram.com")) {
      const result = await ndown(url);
      return res.json({ platform: "instagram", video: result.data[0].url });
    }

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const result = await ytdown(url);
      return res.json({ platform: "youtube", video: result.data.video });
    }

    if (url.includes("twitter.com")) {
      const result = await twitterdown(url);
      return res.json({ platform: "twitter", video: result.data.HD });
    }

    return res.status(400).json({ error: "Unsupported URL" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch video" });
  }
}
