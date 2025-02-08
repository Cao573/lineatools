const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

const app = express();

// Omogućavamo CORS kako bi frontend sa GitHub Pages mogao pristupiti API-ju
app.use(cors());
app.use(express.json());

// API endpoint za download videa
app.post('/download', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    console.error('Greška: URL nije prosleđen.');
    return res.status(400).json({ error: 'URL nije prosleđen' });
  }

  console.log(`Primljen zahtev za URL: ${url}`);

  try {
    const output = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true
    });

    let downloadUrl = null;
    if (output.formats && output.formats.length > 0) {
      // Odabir formata sa najvećom visinom (po želji, možeš prilagoditi)
      downloadUrl = output.formats.reduce((best, format) => {
        if (!best) return format;
        return ((format.height || 0) > (best.height || 0)) ? format : best;
      }, null).url;
    } else {
      downloadUrl = output.url;
    }

    console.log(`Vraćam download URL: ${downloadUrl}`);
    res.json({ download_url: downloadUrl });
  } catch (error) {
    console.error('Došlo je do greške:', error);
    res.status(500).json({ error: error.toString() });
  }
});

// Opcioni GET endpoint za proveru rada API-ja (ne koristi se u frontend aplikaciji)
app.get('/', (req, res) => {
  res.send('Backend API za Video Downloader radi!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});
