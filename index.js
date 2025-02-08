const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
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
        const videoURL = decodeURIComponent(req.query.url);

        if (!videoURL) {
            return res.status(400).json({ error: 'URL is required' });
        }

        console.log('Fetching video info for:', videoURL);

        // Koristimo yt-dlp za preuzimanje videa
        const command = `yt-dlp -f best "${videoURL}" -o -`;

        const child = exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error occurred:', error.message);
                return res.status(500).json({ error: 'Something went wrong', details: error.message });
            }
        });

        res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
        res.setHeader('Content-Type', 'video/mp4');

        child.stdout.pipe(res);
        child.stderr.on('data', (data) => {
            console.error('yt-dlp stderr:', data);
        });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
});

// Pokretanje servera
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
