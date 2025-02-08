document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('download-form');
  const videoUrlInput = document.getElementById('video-url');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const videoUrl = videoUrlInput.value.trim();
    if (!videoUrl) {
      resultDiv.innerHTML = '<p style="color:red;">Molimo unesite URL videa.</p>';
      return;
    }

    resultDiv.innerHTML = '<p>Preuzimanje informacija o videu...</p>';

    // OBAVEZNO: Proveri da li je URL tačan! 
    const backendUrl = 'https://lineatools.onrender.com/'; // Zameni sa stvarnim URL-om tvog Render servisa

    fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: videoUrl })
    })
    .then(async response => {
      // Proveri da li je odgovor u JSON formatu
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Ako nije JSON, pročitaj tekst i baci grešku
        const text = await response.text();
        throw new Error("Neočekivan format odgovora: " + text);
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        resultDiv.innerHTML = `<p style="color:red;">Greška: ${data.error}</p>`;
      } else if (data.download_url) {
        resultDiv.innerHTML = `<a href="${data.download_url}" target="_blank" download>Kliknite ovde da preuzmete video</a>`;
      } else {
        resultDiv.innerHTML = `<p>Nema dostupnog preuzimanja.</p>`;
      }
    })
    .catch(error => {
      console.error('Greška u fetch pozivu:', error);
      resultDiv.innerHTML = `<p style="color:red;">Došlo je do greške: ${error.message}</p>`;
    });
  });
});
