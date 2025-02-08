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

        // Komanda za yt-dlp
        const command = `./yt-dlp -f "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]" "${videoURL}" -o -`;

        const child = exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error occurred:', error.message);
                return res.status(500).json({ error: 'Something went wrong', details: error.message });
            }
        });

        // Postavi zaglavlja za preuzimanje
        res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
        res.setHeader('Content-Type', 'video/mp4');

        // Logiraj stdout i stderr
        child.stdout.on('data', (data) => {
            console.log('yt-dlp stdout:', data.toString());
        });

        child.stderr.on('data', (data) => {
            console.error('yt-dlp stderr:', data.toString());
        });

        // Pošalji video korisniku
        child.stdout.pipe(res);
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
});

// Pokretanje servera
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
