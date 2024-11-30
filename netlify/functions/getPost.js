const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

exports.handler = async (event) => {
  const { id } = event.queryStringParameters;
  
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Post ID is required' })
    };
  }
  
  try {
    const filePath = path.join(process.cwd(), 'content', 'posts', `${id}.md`);
    const content = await fs.promises.readFile(filePath, 'utf8');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/markdown'
      },
      body: content
    };
  } catch (error) {
    console.error('Error reading post:', error);
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Post not found' })
    };
  }
}