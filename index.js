const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cv = require('opencv4nodejs');
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

        // Učitaj sliku pomoću OpenCV
        const image = await cv.imreadAsync(filePath);

        // Pretvori sliku u HSV format za bolju detekciju boja
        const hsvImage = await image.cvtColorAsync(cv.COLOR_BGR2HSV);

        // Definiraj raspon boja za pozadinu (npr., bijela pozadina)
        const lowerBound = new cv.Vec(0, 0, 200); // Donja granica boje
        const upperBound = new cv.Vec(180, 30, 255); // Gornja granica boje

        // Stvori masku za detekciju pozadine
        const mask = await hsvImage.inRangeAsync(lowerBound, upperBound);

        // Invertiraj masku da se zadrže predmeti na slici
        const invertedMask = await mask.bitwiseNotAsync();

        // Primijeni masku na originalnu sliku
        const result = await image.copyToWithMaskAsync(invertedMask);

        // Spremi rezultat
        await cv.imwriteAsync(outputPath, result);

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
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
});

// Pokretanje servera
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
