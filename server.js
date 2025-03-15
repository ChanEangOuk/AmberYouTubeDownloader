const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle video download requests
app.post('/download', async (req, res) => {
  const { url } = req.body;
  console.log(`Received URL: ${url}`); // Log the received URL

  if (!ytdl.validateURL(url)) {
    console.log('Invalid YouTube URL'); // Log invalid URL
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    console.log('Fetching video info...'); // Log fetching video info
    const videoInfo = await ytdl.getInfo(url);
    console.log('Video info fetched successfully'); // Log successful fetch

    const videoTitle = videoInfo.videoDetails.title.replace(/[^\w\s]/gi, '');
    const downloadLink = `/download-video?url=${encodeURIComponent(url)}&title=${encodeURIComponent(videoTitle)}`;

    res.json({ downloadLink });
  } catch (error) {
    console.error('Error fetching video details:', error); // Log error details

    if (error.statusCode === 410) {
      return res.status(404).json({ error: 'The video has been deleted or is no longer available.' });
    }

    res.status(500).json({ error: 'Failed to fetch video details' });
  }
});

// Stream video for download
app.get('/download-video', (req, res) => {
  const { url, title } = req.query;

  if (!url || !title) {
    console.log('Missing URL or title'); // Log missing parameters
    return res.status(400).send('Missing URL or title');
  }

  console.log(`Streaming video: ${url} with title: ${title}`); // Log streaming details

  res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
  ytdl(url, { format: 'mp4' }).pipe(res);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
