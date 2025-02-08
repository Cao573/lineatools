const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();

// Omogućavanje CORS-a
app.use(cors());

// Postavljanje statičkog foldera
app.use(express.static(path.join(__dirname, 'public')));

// Služenje index.html kada neko dođe na /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API ruta za preuzimanje videa
app.post('/download', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'Nema unetog URL-a!' });
    }

    console.log(`Primljen zahtev za preuzimanje: ${url}`);

    exec(`yt-dlp -f best --get-url "${url}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Greška: ${stderr}`);
            return res.status(500).json({ error: 'Greška pri preuzimanju videa!' });
        }

        const downloadUrl = stdout.trim();
        console.log(`Download link: ${downloadUrl}`);
        res.json({ download_url: downloadUrl });
    });
});

// Pokretanje servera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server pokrenut na portu ${PORT}`);
});
