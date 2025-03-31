const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Filter = require('bad-words');

// 4chan /pol/ board URL
const POL_BOARD_URL = 'https://boards.4chan.org/pol/';
const POL_CATALOG_URL = 'https://boards.4chan.org/pol/catalog';
const POL_THREAD_URL = 'https://boards.4chan.org/pol/thread/';

// Thread model (assuming MongoDB is used)
const PolThreadSchema = new mongoose.Schema({
  threadId: { type: String, unique: true },
  title: String,
  content: String,
  imageUrl: String,
  thumbnailUrl: String,
  postDate: Date,
  isNsfw: { type: Boolean, default: false },
  isFiltered: { type: Boolean, default: false },
  importedAt: { type: Date, default: Date.now },
  lastCheckedAt: { type: Date, default: Date.now },
  postCount: { type: Number, default: 0 },
  isNew: { type: Boolean, default: true }
});

const PolThread = mongoose.model('PolThread', PolThreadSchema);

// Initialize content filter
const filter = new Filter();
// Add additional terms to filter
filter.addWords(
  'lgbt', 'trans', 'gay', 'homosexual', 'faggot', 'queer', 'degenerate', 
  'degeneracy', 'decadence', 'decadent'
);

// Function to check if content should be filtered
function shouldFilterContent(text, imageUrl) {
  if (!text) return false;
  
  // Check for filtered words
  if (filter.isProfane(text.toLowerCase())) {
    return true;
  }
  
  // Additional filtering logic can be added here
  // For example, image recognition would be ideal but is beyond the scope
  
  return false;
}

// Function to fetch threads from 4chan /pol/ catalog
async function fetchPolCatalog() {
  try {
    console.log('Fetching 4chan /pol/ catalog...');
    const response = await axios.get(POL_CATALOG_URL);
    const $ = cheerio.load(response.data);
    
    // Extract thread data from the catalog
    const threads = [];
    const threadElements = $('.thread');
    
    threadElements.each((i, element) => {
      const $element = $(element);
      const threadId = $element.attr('id').replace('thread-', '');
      const subject = $element.find('.subject').text().trim();
      const comment = $element.find('.comment').text().trim();
      const title = subject || comment.substring(0, 50) + (comment.length > 50 ? '...' : '');
      const thumbnailUrl = $element.find('.thumb').attr('src');
      const postCount = parseInt($element.find('.post-count').text().trim(), 10) || 0;
      
      // Combine subject and comment for content filtering
      const fullContent = `${subject} ${comment}`;
      const isFiltered = shouldFilterContent(fullContent, thumbnailUrl);
      
      if (!isFiltered) {
        threads.push({
          threadId,
          title,
          content: comment,
          thumbnailUrl: thumbnailUrl ? `https:${thumbnailUrl}` : null,
          postDate: new Date(),
          postCount,
          isFiltered: false
        });
      }
    });
    
    return threads;
  } catch (error) {
    console.error('Error fetching 4chan /pol/ catalog:', error);
    return [];
  }
}

// Function to fetch a specific thread from 4chan /pol/
async function fetchPolThread(threadId) {
  try {
    console.log(`Fetching 4chan /pol/ thread ${threadId}...`);
    const response = await axios.get(`${POL_THREAD_URL}${threadId}`);
    const $ = cheerio.load(response.data);
    
    // Extract thread data
    const posts = [];
    const postElements = $('.post');
    
    postElements.each((i, element) => {
      const $element = $(element);
      const postId = $element.attr('id').replace('p', '');
      const comment = $element.find('.postMessage').text().trim();
      const imageUrl = $element.find('.fileThumb').attr('href');
      const postDate = $element.find('.dateTime').attr('data-utc');
      
      // Check if content should be filtered
      const isFiltered = shouldFilterContent(comment, imageUrl);
      
      if (!isFiltered) {
        posts.push({
          postId,
          comment,
          imageUrl: imageUrl ? `https:${imageUrl}` : null,
          postDate: postDate ? new Date(parseInt(postDate, 10) * 1000) : new Date()
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error(`Error fetching 4chan /pol/ thread ${threadId}:`, error);
    return [];
  }
}

// Function to import new threads from 4chan /pol/
async function importPolThreads() {
  try {
    console.log('Importing new threads from 4chan /pol/...');
    const threads = await fetchPolCatalog();
    let newThreadsCount = 0;
    
    for (const thread of threads) {
      // Check if thread already exists
      const existingThread = await PolThread.findOne({ threadId: thread.threadId });
      
      if (!existingThread) {
        // Create new thread
        const newThread = new PolThread({
          ...thread,
          isNew: true
        });
        
        await newThread.save();
        newThreadsCount++;
        console.log(`Imported new thread: ${thread.threadId} - ${thread.title}`);
      } else {
        // Update existing thread
        existingThread.lastCheckedAt = new Date();
        existingThread.postCount = thread.postCount;
        
        // If post count increased, mark as having new content
        if (thread.postCount > existingThread.postCount) {
          existingThread.isNew = true;
        }
        
        await existingThread.save();
      }
    }
    
    console.log(`Imported ${newThreadsCount} new threads from 4chan /pol/`);
    return newThreadsCount;
  } catch (error) {
    console.error('Error importing threads from 4chan /pol/:', error);
    return 0;
  }
}

// Schedule the import to run every 15 minutes
function schedulePolImports() {
  cron.schedule('*/15 * * * *', () => {
    console.log('Running scheduled import of 4chan /pol/ threads...');
    importPolThreads();
  });
}

// Initial import when the server starts
async function initializePolIntegration() {
  console.log('Initializing 4chan /pol/ integration...');
  await importPolThreads();
  schedulePolImports();
}

module.exports = {
  initializePolIntegration,
  importPolThreads,
  fetchPolThread,
  PolThread
};
