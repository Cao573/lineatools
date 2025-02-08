const express = require('express');
const cors = require('cors');
const path = require('path');
const youtubedl = require('youtube-dl-exec');

const app = express();

// Omogućavanje CORS-a i parsiranje JSON tela zahteva
app.use(cors());
app.use(express.json());

// Serviranje statičnih fajlova iz foldera "public"
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint za download videa
app.post('/download', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL nije prosleđen' });
  }

  try {
    // Pozivamo youtube-dl-exec da bismo izvukli informacije o videu
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

// Opcioni fallback route da bi se uvek učitala index.html stranica
// (ovo je korisno ako koristiš HTML5 routing na frontend-u)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});
