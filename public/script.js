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

        resultDiv.innerHTML = '<p>🔄 Preuzimanje informacija o videu...</p>';

        const backendUrl = 'https://lineatools.onrender.com//download';  // Zameni sa pravim URL-om

        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: videoUrl })
        })
        .then(async response => {
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                throw new Error("Neočekivan odgovor: " + text);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                resultDiv.innerHTML = `<p style="color:red;">⚠️ Greška: ${data.error}</p>`;
            } else if (data.download_url) {
                resultDiv.innerHTML = `<a href="${data.download_url}" target="_blank" download>📥 Kliknite ovde da preuzmete video</a>`;
            } else {
                resultDiv.innerHTML = `<p>🚫 Nema dostupnog preuzimanja.</p>`;
            }
        })
        .catch(error => {
            console.error('Greška:', error);
            resultDiv.innerHTML = `<p style="color:red;">⚠️ Greška: ${error.message}</p>`;
        });
    });
});
