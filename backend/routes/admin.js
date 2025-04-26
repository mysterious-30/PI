const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Tool = require('../models/Tool');
const User = require('../models/User');

// Middleware to check admin status
const isAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tools (admin view)
router.get('/tools', isAdmin, async (req, res) => {
  try {
    const tools = await Tool.find().sort({ createdAt: -1 });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new tool
router.post('/tools', [
  isAdmin,
  body('name').trim().notEmpty(),
  body('slug').trim().notEmpty(),
  body('category').isIn(Tool.schema.path('category').enumValues),
  body('description').trim().notEmpty(),
  body('inputFields').isArray(),
  body('outputFields').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tool = new Tool(req.body);
    await tool.save();

    res.status(201).json(tool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update tool
router.put('/tools/:id', [
  isAdmin,
  body('name').optional().trim().notEmpty(),
  body('slug').optional().trim().notEmpty(),
  body('category').optional().isIn(Tool.schema.path('category').enumValues),
  body('description').optional().trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete tool
router.delete('/tools/:id', isAdmin, async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics
router.get('/analytics', isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTools = await Tool.countDocuments();
    const totalUsage = await Tool.aggregate([
      { $group: { _id: null, total: { $sum: '$usageCount' } } }
    ]);

    const popularTools = await Tool.find()
      .sort({ usageCount: -1 })
      .limit(10)
      .select('name category usageCount');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt');

    res.json({
      totalUsers,
      totalTools,
      totalUsage: totalUsage[0]?.total || 0,
      popularTools,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 