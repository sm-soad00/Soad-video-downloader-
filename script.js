async function getVideo() {
  const url = document.getElementById("url").value;
  const result = document.getElementById("result");

  if (!url) {
    alert("Enter video URL!");
    return;
  }

  result.innerHTML = "⏳ Processing...";

  try {
    const res = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    console.log(data);

    if (!data || data.status === false) {
      result.innerHTML = "❌ Unsupported URL";
      return;
    }

    let videoUrl = "";

    if (data.data?.video) {
      videoUrl = data.data.video;
    } else if (data.data?.url) {
      videoUrl = data.data.url;
    } else if (data.data?.medias?.length > 0) {
      videoUrl = data.data.medias[0].url;
    }

    if (!videoUrl) {
      result.innerHTML = "❌ Video not found!";
      return;
    }

    result.innerHTML = `
      <video controls src="${videoUrl}"></video>
      <a href="${videoUrl}" download class="download">⬇️ Download Video</a>
    `;

  } catch (err) {
    console.error(err);
    result.innerHTML = "❌ Server error!";
  }
}
