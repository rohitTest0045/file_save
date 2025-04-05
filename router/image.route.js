const { Router } = require("express");
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const imageRouter = Router();

// Configure upload directory
const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

imageRouter.post('/upload', async (req, res) => {
  try {
    const { base64 } = req.body;
    
    if (!base64) {
      return res.status(400).json({ error: 'No base64 data provided' });
    }

    // Extract MIME type and data
    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 format' });
    }

    const mimeType = matches[1];
    const data = matches[2];
    const extension = mime.extension(mimeType) || 'bin';
    const filename = `${uuidv4()}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // Convert and save
    const buffer = Buffer.from(data, 'base64');
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error('Error saving file:', err);
        return res.status(500).json({ error: 'Error saving file' });
      }

      res.json({
        url: `${req.protocol}://${req.get('host')}/uploads/${filename}`
      });
    });
    
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = { imageRouter };