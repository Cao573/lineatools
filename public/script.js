document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const message = document.getElementById('message');
    const resultImage = document.getElementById('resultImage');

    const formData = new FormData();
    const fileInput = document.getElementById('imageUpload');
    formData.append('image', fileInput.files[0]);

    message.textContent = 'Processing...';
    message.style.color = 'blue';

    try {
        const response = await fetch('/remove-background', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('An error occurred while processing the image');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        resultImage.src = url;
        resultImage.style.display = 'block';
        message.textContent = 'Background removed successfully!';
        message.style.color = 'green';
    } catch (error) {
        console.error('Error removing background:', error.message);
        message.textContent = error.message;
        message.style.color = 'red';
    }
});
