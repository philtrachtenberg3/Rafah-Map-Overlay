const express = require('express');
const path = require('path'); 
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

// Serve your static files (HTML, CSS, your map JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to fetch your Google Maps API key
app.get('/api/key', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
