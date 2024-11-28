const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

exports.handler = async (event) => {
  const { id } = event.queryStringParameters;

  try {
    const postsDirectory = path.join(process.cwd(), 'content/posts');
    const filePath = path.join(postsDirectory, `${id}.md`);
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        id,
        title: data.title,
        date: data.date,
        description: data.description,
        thumbnail: data.thumbnail,
        tags: data.tags,
        body: content
      })
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Post not found' })
    };
  }
};