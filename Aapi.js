// File path: api/download.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    const api = `https://masterapi.fun/api/alldl?url=${encodeURIComponent(url)}`;
    const response = await fetch(api);
    const data = await response.json();

    if (data && data.url && data.url[0]) {
      return res.status(200).json({ video: data.url[0].url });
    } else {
      return res.status(500).json({ error: 'Failed to fetch video URL' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching video' });
  }
}
