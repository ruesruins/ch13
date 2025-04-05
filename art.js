const express = require('express');
const app = express();
const port = 3000;
const artData = require('./paintings.json'); // Import the JSON as a module

// Provider module for paintings data
const paintingsProvider = {
    getAllPaintings: () => artData,
    getPaintingById: (id) => artData.find(painting => painting.paintingID == id),
    getPaintingsByGalleryId: (galleryId) => artData.filter(painting => painting.gallery.galleryID == galleryId),
    getPaintingsByArtistId: (artistId) => artData.filter(painting => painting.artist.artistID == artistId),
    getPaintingsByYearRange: (min, max) => artData.filter(painting => painting.yearOfWork >= min && painting.yearOfWork <= max)
};

// Serve static files from the 'static' folder
app.use(express.static('static'));

// Add GET route handlers
app.get('/', (req, res) => {
    res.json(paintingsProvider.getAllPaintings());
});

app.get('/:id', (req, res) => {
    const painting = paintingsProvider.getPaintingById(req.params.id);
    if (painting) {
        res.json(painting);
    } else {
        res.status(404).json({ error: 'Painting not found' });
    }
});

app.get('/gallery/:id', (req, res) => {
    const galleryPaintings = paintingsProvider.getPaintingsByGalleryId(req.params.id);
    res.json(galleryPaintings);
});

app.get('/artist/:id', (req, res) => {
    const artistPaintings = paintingsProvider.getPaintingsByArtistId(req.params.id);
    res.json(artistPaintings);
});

app.get('/year/:min/:max', (req, res) => {
    const min = parseInt(req.params.min);
    const max = parseInt(req.params.max);
    
    if (isNaN(min) || isNaN(max)) {
        res.status(400).json({ error: 'Invalid year range parameters' });
        return;
    }
    
    const paintingsInRange = paintingsProvider.getPaintingsByYearRange(min, max);
    res.json(paintingsInRange);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});