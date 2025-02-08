document.getElementById('downloadForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const videoUrl = document.getElementById('videoUrl').value;
    const message = document.getElementById('message');

    if (!videoUrl) {
        message.textContent = 'Please enter a valid YouTube URL';
        message.style.color = 'red';
        return;
    }

    message.textContent = 'Downloading...';
    message.style.color = 'blue';

    try {
        const response = await fetch(`/download?url=${encodeURIComponent(videoUrl)}`, {
            method: 'GET',
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'video.mp4';
            document.body.appendChild(a);
            a.click();
            a.remove();
            message.textContent = 'Download completed!';
            message.style.color = 'green';
        } else {
            message.textContent = 'Error downloading video';
            message.style.color = 'red';
        }
    } catch (error) {
        console.error(error);
        message.textContent = 'An error occurred while downloading the video';
        message.style.color = 'red';
    }
});
