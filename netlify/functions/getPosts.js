const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

exports.handler = async (event) => {
  try {
    const postsDirectory = path.join(process.cwd(), 'content/posts');
    const files = await fs.promises.readdir(postsDirectory);
    
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async (file) => {
          const filePath = path.join(postsDirectory, file);
          const fileContent = await fs.promises.readFile(filePath, 'utf8');
          const { data, content } = matter(fileContent);
          
          return {
            id: file.replace('.md', ''),
            title: data.title,
            date: data.date,
            description: data.description,
            thumbnail: data.thumbnail,
            tags: data.tags,
            body: content
          };
        })
    );
    
    // Sort posts by date
    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      statusCode: 200,
      body: JSON.stringify(sortedPosts)
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch posts' })
    };
  }
};