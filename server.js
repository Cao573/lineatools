// server.js

const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

const app = express();

// Omogućavamo CORS da bi GitHub Pages mogao da pristupi API-ju
app.use(cors());
app.use(express.json());

// Opcioni GET route za root URL
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/download', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL nije prosleđen' });
  }

  try {
    // Pozivamo youtube-dl-exec kako bismo izvukli informacije o videu u JSON formatu
    const output = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true
    });
    
    let downloadUrl = null;
    if (output.formats && output.formats.length > 0) {
      // Pronalaženje formata sa najvećom visinom (može se prilagoditi)
      downloadUrl = output.formats.reduce((best, format) => {
        if (!best) return format;
        return ((format.height || 0) > (best.height || 0)) ? format : best;
      }, null).url;
    } else {
      downloadUrl = output.url;
    }
    
    res.json({ download_url: downloadUrl });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});
