const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();

app.use(cors());  // Omogućava API da radi sa frontendom
app.use(express.json());

app.post('/download', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'Nema unetog URL-a!' });
    }

    console.log(`Primljen zahtev za preuzimanje: ${url}`);

    // Pokreće yt-dlp i dobija URL fajla za preuzimanje
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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server pokrenut na portu ${PORT}`);
});
