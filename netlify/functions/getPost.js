const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { Octokit } = require('@octokit/rest');

exports.handler = async (event) => {
  const { id } = event.queryStringParameters;
  
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Post ID is required' })
    };
  }
  
  try {
    // Local development
    if (process.env.NETLIFY_DEV) {
      const filePath = path.join(process.cwd(), 'content', 'posts', `${id}.md`);
      const content = await fs.promises.readFile(filePath, 'utf8');
      const { data, content: markdown } = matter(content);
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id,
          title: data.title,
          date: data.date,
          description: data.description,
          thumbnail: data.thumbnail,
          tags: data.tags,
          body: markdown
        })
      };
    }
    
    // Production - using GitHub API
    const octokit = new Octokit({
      auth: process.env.GITHUBTOKEN
    });

    const { data: fileData } = await octokit.repos.getContent({
      owner: process.env.GITHUBOWNER,
      repo: process.env.GITHUBREPO,
      path: `content/posts/${id}.md`
    });

    const content = Buffer.from(fileData.content, 'base64').toString();
    const { data, content: markdown } = matter(content);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        title: data.title,
        date: data.date,
        description: data.description,
        thumbnail: data.thumbnail,
        tags: data.tags,
        body: markdown
      })
    };
    
  } catch (error) {
    console.error('Error reading post:', error);
    return {
      statusCode: 500,  // Changed from 404 to 500 for server errors
      body: JSON.stringify({ 
        message: 'Error fetching post',
        error: error.message,  // Add the actual error message
        path: `content/posts/${id}.md`  // Add the attempted path
      })
    };
}
};