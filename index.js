const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to restrict access based on origin and API key
app.use((req, res, next) => {
    const allowedOrigins = ['https://bypassunlock.com'];
    const apiKey = req.query.api_key;
    
    // Check if request is coming from allowed origin or if API key is provided
    if (allowedOrigins.includes(req.headers.origin) || apiKey === 'Zx9Lm3Qp7Rt2Sv8W') {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
});

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/api/supported', async (req, res) => {
    try {
        const response = await axios.get('http://45.140.188.129:6534/api/adlinks/supported');
        const supportedData = response.data;
        res.json(supportedData); // Return supported data as JSON
    } catch (error) {
        console.error('error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle /api/bypass?link=LINK
app.get('/api/bypass', async (req, res) => {
    try {
        const link = req.query.link;
        if (!link) {
            return res.status(400).json({ error: 'Link parameter is required' });
        }

        const response = await axios.get(`http://45.140.188.129:6534api/adlinks/bypass?url=${link}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
