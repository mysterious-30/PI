const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const User = require('../models/User');

// Track tool usage
router.post('/track-usage/:toolId', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.toolId);
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    await tool.incrementUsage();
    res.json({ message: 'Usage tracked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tool usage statistics
router.get('/tool-usage/:toolId', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.toolId)
      .select('name category usageCount lastUsed');
    
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    // Get daily usage for the last 30 days
    const dailyUsage = await Tool.aggregate([
      { $match: { _id: tool._id } },
      {
        $project: {
          usageCount: 1,
          lastUsed: 1,
          dailyUsage: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$lastUsed'
            }
          }
        }
      },
      {
        $group: {
          _id: '$dailyUsage',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);

    res.json({
      tool,
      dailyUsage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user activity
router.get('/user-activity/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('name email lastLogin');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's favorite tools
    const favoriteTools = await Tool.find({
      _id: { $in: user.favorites }
    }).select('name category usageCount');

    // Get user's recently used tools
    const recentlyUsed = await Tool.find({
      lastUsed: { $exists: true }
    })
    .sort({ lastUsed: -1 })
    .limit(5)
    .select('name category lastUsed');

    res.json({
      user,
      favoriteTools,
      recentlyUsed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get category statistics
router.get('/category-stats', async (req, res) => {
  try {
    const categoryStats = await Tool.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalUsage: { $sum: '$usageCount' },
          avgUsage: { $avg: '$usageCount' }
        }
      },
      { $sort: { totalUsage: -1 } }
    ]);

    res.json(categoryStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 