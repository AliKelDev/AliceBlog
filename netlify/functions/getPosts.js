const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

exports.handler = async function(event, context) {
  try {
    // Set the content directory where your posts are stored
    const contentDirectory = path.join(process.cwd(), 'content/posts');
    
    // Read all files from the posts directory
    let files;
    try {
      files = await fs.readdir(contentDirectory);
    } catch (error) {
      // If directory doesn't exist or can't be read, return empty array
      console.error('Error reading directory:', error);
      return {
        statusCode: 200,
        body: JSON.stringify([])
      };
    }
    
    // Process each markdown file
    const posts = await Promise.all(
      files
        .filter(filename => filename.endsWith('.md'))
        .map(async filename => {
          try {
            const filePath = path.join(contentDirectory, filename);
            const fileContent = await fs.readFile(filePath, 'utf8');
            
            // Parse the front matter and content
            const { data, content } = matter(fileContent);
            
            return {
              id: filename.replace('.md', ''),
              slug: filename.replace('.md', ''),
              title: data.title || 'Untitled Post',
              date: data.date || new Date().toISOString(),
              content: content,
              excerpt: data.excerpt || content.slice(0, 150) + '...',
              ...data // Include any additional front matter fields
            };
          } catch (error) {
            console.error(`Error processing file ${filename}:`, error);
            return null;
          }
        })
    );

    // Filter out any null entries from failed processing
    // and sort by date (most recent first)
    const validPosts = posts
      .filter(post => post !== null)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // Add CORS headers if needed
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(validPosts)
    };
    
  } catch (error) {
    console.error('Error in getPosts function:', error);
    return { 
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch posts',
        message: error.message 
      })
    };
  }
};