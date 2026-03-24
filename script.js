async function getVideo() {
  const url = document.getElementById("url").value;
  const result = document.getElementById("result");

  if (!url) {
    alert("Enter video URL!");
    return;
  }

  result.innerHTML = "⏳ Fetching video...";

  try {
    // 🔥 CORS proxy use
    const apiUrl = "https://nayan-video-downloader.vercel.app/alldown?url=" + encodeURIComponent(url);
    const proxy = "https://api.allorigins.win/raw?url=" + encodeURIComponent(apiUrl);

    const res = await fetch(proxy);
    const data = await res.json();

    console.log("Response:", data);

    if (!data || data.status === false) {
      result.innerHTML = "❌ Unsupported URL or API failed";
      return;
    }

    let videoUrl = "";

    // 🔍 detect video link
    if (data.data?.video) {
      videoUrl = data.data.video;
    } 
    else if (data.data?.url) {
      videoUrl = data.data.url;
    } 
    else if (data.data?.medias && data.data.medias.length > 0) {
      videoUrl = data.data.medias[0].url;
    }

    if (!videoUrl) {
      result.innerHTML = "❌ Video not found!";
      return;
    }

    // 🎬 show video
    result.innerHTML = `
      <video controls src="${videoUrl}"></video>
      <a href="${videoUrl}" download class="download">⬇️ Download Video</a>
    `;

  } catch (error) {
    console.error(error);
    result.innerHTML = "❌ Server error / CORS blocked!";
  }
}
