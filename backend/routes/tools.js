const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const sharp = require('sharp');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Text Tools
router.post('/word-counter', [
  body('text').isString().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const charCount = text.length;
    const charCountNoSpaces = text.replace(/\s/g, '').length;
    const lineCount = text.split('\n').length;

    res.json({
      wordCount,
      charCount,
      charCountNoSpaces,
      lineCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Image Tools
router.post('/image-resizer', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { width, height } = req.body;
    const resizedImage = await sharp(req.file.buffer)
      .resize(parseInt(width), parseInt(height))
      .toBuffer();

    res.set('Content-Type', 'image/jpeg');
    res.send(resizedImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SEO Tools
router.post('/meta-tags', [
  body('url').isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url } = req.body;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const metaTags = {};
    $('meta').each((i, el) => {
      const name = $(el).attr('name') || $(el).attr('property');
      const content = $(el).attr('content');
      if (name && content) {
        metaTags[name] = content;
      }
    });

    res.json({
      title: $('title').text(),
      metaTags,
      description: metaTags.description || '',
      keywords: metaTags.keywords || '',
      ogTags: {
        title: metaTags['og:title'] || '',
        description: metaTags['og:description'] || '',
        image: metaTags['og:image'] || ''
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Converter Tools
router.post('/html-to-text', [
  body('html').isString().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { html } = req.body;
    const $ = cheerio.load(html);
    const text = $('body').text().trim();

    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculator Tools
router.post('/percentage-calculator', [
  body('value').isNumeric(),
  body('percentage').isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { value, percentage } = req.body;
    const result = (value * percentage) / 100;

    res.json({
      originalValue: value,
      percentage,
      result,
      increasedValue: value + result,
      decreasedValue: value - result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 