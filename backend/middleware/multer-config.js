const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const optimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const extension = MIME_TYPES[req.file.mimetype];
  const filename = `${req.file.originalname.split(' ').join('_')}${Date.now()}.${extension}`;
  const outputPath = path.join('images', filename);

  try {
    await sharp(req.file.buffer)
      .resize({ width: 800 }) 
      .toFormat(extension)
      .jpeg({ quality: 80 }) 
      .toFile(outputPath);

    req.file.filename = filename; 
    next();
  } catch (error) {
    console.error('Error optimizing image:', error);
    res.status(500).json({ error: 'Error optimizing image' });
  }
};

module.exports = { upload, optimizeImage };
