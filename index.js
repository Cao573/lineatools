const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer za upload slike
const upload = multer({ dest: 'uploads/' });

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Route za uklanjanje pozadine
app.post('/remove-background', upload.single('image'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const outputPath = path.join(__dirname, 'public', 'output.png');

        // Pozovi rembg CLI za uklanjanje pozadine
        const command = `rembg i ${filePath} ${outputPath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error occurred:', error.message);
                return res.status(500).json({ error: 'Something went wrong', details: error.message });
            }

            // Pošalji obrisanu sliku korisniku
            res.sendFile(outputPath, (err) => {
                if (err) {
                    console.error('Error sending file:', err.message);
                    res.status(500).json({ error: 'Something went wrong' });
                }

                // Izbriši privremene datoteke
                fs.unlinkSync(filePath);
                fs.unlinkSync(outputPath);
            });
        });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
});

// Pokretanje servera
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
