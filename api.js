export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    const api = await fetch(`https://nayan-video-downloader.vercel.app/alldown?url=${encodeURIComponent(url)}`);
    const data = await api.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
