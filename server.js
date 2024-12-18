const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(express.static(__dirname));
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

app.post('/save-data', async (req, res) => {
    try {
        let existingData = [];
        try {
            const data = await fs.readFile(DATA_FILE, 'utf8');
            existingData = JSON.parse(data);
        } catch (error) {
            // File doesn't exist yet, start with empty array
        }

        existingData.push(req.body);
        await fs.writeFile(DATA_FILE, JSON.stringify(existingData, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ success: false, error: 'Failed to save data' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
