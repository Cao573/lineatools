const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Route za preuzimanje videa
app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        if (!videoURL) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const info = await ytdl.getInfo(videoURL);
        const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highest' });

        res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        ytdl(videoURL, { format: videoFormat })
            .pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Pokretanje servera
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
