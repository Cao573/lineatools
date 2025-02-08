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

    // Zamenite ispod sa URL-om vašeg Node backend-a na Render-u
    const backendUrl = 'https://lineatools.onrender.com/download';

    fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: videoUrl })
    })
    .then(response => response.json())
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
      console.error('Error:', error);
      resultDiv.innerHTML = `<p style="color:red;">Došlo je do greške prilikom preuzimanja informacija.</p>`;
    });
  });
});
