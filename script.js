async function getVideo() {
  const url = document.getElementById("url").value;

  if (!url) {
    alert("Enter video URL!");
    return;
  }

  const api = `https://nayan-video-downloader.vercel.app/alldown?url=${encodeURIComponent(url)}`;

  document.getElementById("result").innerHTML = "⏳ Loading...";

  try {
    const res = await fetch(api);
    const data = await res.json();

    console.log(data); // debug দেখতে

    if (!data.status) {
      document.getElementById("result").innerHTML = "❌ Unsupported or invalid URL";
      return;
    }

    // different API structure handle
    let videoUrl = "";

    if (data.data && data.data.video) {
      videoUrl = data.data.video;
    } else if (data.data && data.data.url) {
      videoUrl = data.data.url;
    } else if (data.data && data.data.medias) {
      videoUrl = data.data.medias[0].url;
    }

    if (!videoUrl) {
      document.getElementById("result").innerHTML = "❌ Video not found!";
      return;
    }

    document.getElementById("result").innerHTML = `
      <video controls src="${videoUrl}"></video>
      <a href="${videoUrl}" download class="download">⬇️ Download Video</a>
    `;

  } catch (err) {
    document.getElementById("result").innerHTML = "❌ Server error!";
  }
}
