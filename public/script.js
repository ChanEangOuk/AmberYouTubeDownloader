document.getElementById('downloadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const videoUrl = document.getElementById('videoUrl').value;
  const statusDiv = document.getElementById('status');

  statusDiv.textContent = 'Downloading...';

  try {
    const response = await fetch('/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: videoUrl }),
    });

    if (response.ok) {
      const data = await response.json();
      statusDiv.innerHTML = `<a href="${data.downloadLink}" download>Click here to download your video</a>`;
    } else {
      statusDiv.textContent = 'Error: Unable to download the video.';
    }
  } catch (error) {
    statusDiv.textContent = 'An unexpected error occurred.';
  }
});
