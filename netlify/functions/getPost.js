import { readFile } from 'fs/promises';
import { join } from 'path';

export async function handler(event) {
  const { id } = event.queryStringParameters;
  
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Post ID is required' })
    };
  }
  
  try {
    // Read the actual markdown file
    const filePath = join(process.cwd(), 'content', 'posts', `${id}.md`);
    const content = await readFile(filePath, 'utf8');
    
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