export default async function handler(req, res) {
  const { url, type } = req.query;

  if (!url || !type) {
    return res.status(400).json({ error: "Missing url or type" });
  }

  let api = "";
  if (type === "ig") {
    api = `https://api-aryan-xyz.vercel.app/igdl?url=${encodeURIComponent(url)}&apikey=ArYAN`;
  } else if (type === "tik") {
    api = `https://api-aryan-xyz.vercel.app/tikdl?url=${encodeURIComponent(url)}&apikey=ArYAN`;
  } else if (type === "fb") {
    api = `https://api-aryan-xyz.vercel.app/fbdl?url=${encodeURIComponent(url)}&apikey=ArYAN`;
  } else if (type === "yt") {
    api = `https://api-aryan-xyz.vercel.app/ytdl?url=${encodeURIComponent(url)}&apikey=ArYAN`;
  }

  try {
    const response = await fetch(api);
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch from API" });
  }
}
