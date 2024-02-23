const express = require('express');
const path = require('path'); 
require('dotenv').config(); // Load environment variables at the top

const app = express();
const port = process.env.PORT || 3000; 

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint for Google Maps API key
app.get('/api/key', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

// Route for the root path ('/')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
