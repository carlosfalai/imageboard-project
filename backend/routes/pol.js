const express = require('express');
const router = express.Router();
const polService = require('../services/polService');
const { isAuthenticated, isAdult } = require('../middleware/auth');

// Route to manually trigger import of 4chan /pol/ threads (for testing)
router.get('/import-threads', async (req, res) => {
  try {
    const newThreadsCount = await polService.importPolThreads();
    res.json({ success: true, message: `Imported ${newThreadsCount} new threads from 4chan /pol/` });
  } catch (error) {
    console.error('Error importing 4chan /pol/ threads:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get recent threads from 4chan /pol/ (requires age verification)
router.get('/threads', isAdult, async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    const threads = await polService.PolThread.find({ isFiltered: false })
      .sort({ importedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));
    
    const totalThreads = await polService.PolThread.countDocuments({ isFiltered: false });
    
    res.json({ 
      success: true, 
      threads,
      pagination: {
        total: totalThreads,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(totalThreads / limit)
      }
    });
  } catch (error) {
    console.error('Error getting 4chan /pol/ threads:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get a specific thread by ID (requires age verification)
router.get('/thread/:threadId', isAdult, async (req, res) => {
  try {
    const { threadId } = req.params;
    
    // Get thread from database
    const thread = await polService.PolThread.findOne({ threadId, isFiltered: false });
    
    if (!thread) {
      return res.status(404).json({ success: false, error: 'Thread not found' });
    }
    
    // Mark thread as no longer new
    if (thread.isNew) {
      thread.isNew = false;
      await thread.save();
    }
    
    // Fetch latest posts from 4chan
    const posts = await polService.fetchPolThread(threadId);
    
    res.json({ 
      success: true, 
      thread: {
        ...thread.toObject(),
        posts
      }
    });
  } catch (error) {
    console.error('Error getting 4chan /pol/ thread:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get count of new threads
router.get('/new-threads-count', isAdult, async (req, res) => {
  try {
    const newThreadsCount = await polService.PolThread.countDocuments({ 
      isFiltered: false,
      isNew: true
    });
    
    res.json({ success: true, count: newThreadsCount });
  } catch (error) {
    console.error('Error getting new threads count:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to add a comment to a thread (requires authentication and age verification)
router.post('/thread/:threadId/comment', isAuthenticated, isAdult, async (req, res) => {
  try {
    const { threadId } = req.params;
    const { content, imageUrl } = req.body;
    const userId = req.user.id;
    
    // In a real implementation, this would add a comment to the database
    // For now, we'll return a mock response
    
    res.json({ 
      success: true, 
      message: 'Comment added successfully',
      comment: {
        id: `comment-${Date.now()}`,
        threadId,
        userId,
        content,
        imageUrl,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
