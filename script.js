document.getElementById('downloadBtn').addEventListener('click', downloadVideo);

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");

async function normalizeUrl(url) {
  if (url.includes("vm.tiktok.com") || url.includes("vt.tiktok.com")) {
    try {
      const response = await fetch(url, { method: "HEAD", redirect: "follow" });
      return response.url;
    } catch (e) { console.error("TikTok expand failed:", e); }
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return "https://www.youtube.com/watch?v=" + id;
  }
  if (url.includes("fb.watch/")) {
    return url.replace("fb.watch", "www.facebook.com/watch");
  }
  return url;
}

async function downloadVideo() {
  const url = document.getElementById("urlInput").value.trim();
  const statusMessage = document.getElementById("statusMessage");
  const downloadBtn = document.getElementById("downloadBtn");
  const videoPlayer = page2.querySelector('video');
  const downloadLink = document.getElementById("downloadVideoLink");
  const saveBtn = document.getElementById("saveBtn");
  const spinner = page2.querySelector('.spinner');

  if (!url) {
    statusMessage.textContent = "Please enter a valid link.";
    statusMessage.className = "error";
    return;
  }

  let finalUrl = await normalizeUrl(url);

  statusMessage.textContent = "Fetching video... Please wait.";
  statusMessage.className = "loading-text";
  downloadBtn.classList.add("loading");
  downloadBtn.disabled = true;
  page1.style.display = "none";
  page2.style.display = "block";
  videoPlayer.style.display = "none"; // Hide video player initially
  spinner.style.display = "block"; // Show spinner

  try {
    let api = "";
    const apiKey = "ArYAN";

    if (finalUrl.includes("instagram.com")) {
      api = `https://api-aryan-xyz.vercel.app/igdl?url=${encodeURIComponent(finalUrl)}&apikey=${apiKey}`;
    } else if (finalUrl.includes("tiktok.com")) {
      api = `https://api-aryan-xyz.vercel.app/tikdl?url=${encodeURIComponent(finalUrl)}&apikey=${apiKey}`;
    } else if (finalUrl.includes("facebook.com")) {
      api = `https://api-aryan-xyz.vercel.app/fbdl?url=${encodeURIComponent(finalUrl)}&apikey=${apiKey}`;
    } else if (finalUrl.includes("youtube.com")) {
      api = `https://api-aryan-xyz.vercel.app/ytdl?url=${encodeURIComponent(finalUrl)}&apikey=${apiKey}`;
    } else {
      throw new Error("Unsupported link.");
    }

    const res = await fetch(api);
    if (!res.ok) throw new Error("API request failed with status: " + res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.message || "API returned an error.");

    console.log("API Response:", data); // Debugging log

    let videoUrl = "";

    if (finalUrl.includes("instagram.com")) {
      videoUrl = data?.result?.[0]?.url || data?.result?.url;
    } else if (finalUrl.includes("tiktok.com")) {
      videoUrl = data?.result?.[0]?.url || data?.url;
    } else if (finalUrl.includes("facebook.com")) {
      videoUrl = data?.result?.url || data?.result?.videoUrl;
    } else if (finalUrl.includes("youtube.com")) {
      videoUrl =
        data?.result?.response?.["720p"]?.download_url ||
        data?.result?.response?.["360p"]?.download_url;
    }

    if (!videoUrl) throw new Error("No video URL found in the API response.");

    videoPlayer.src = videoUrl;
    videoPlayer.load();

    videoPlayer.onloadeddata = () => {
      spinner.style.display = "none"; // Hide spinner
      videoPlayer.style.display = "block"; // Show video player
      videoPlayer.play();
    };

    downloadLink.href = videoUrl;
    downloadLink.download = `SOAD_video_${Date.now()}.mp4`;

    saveBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = `SOAD_saved_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    statusMessage.textContent = "Video is ready!";
    statusMessage.className = "success";

  } catch (e) {
    statusMessage.textContent = "Video not found. Please check the link.";
    statusMessage.className = "error";
    console.error("Video fetching error:", e);
    spinner.style.display = "none";
    page1.style.display = "block";
    page2.style.display = "none";
  } finally {
    downloadBtn.classList.remove("loading");
    downloadBtn.disabled = false;
  }
        }
