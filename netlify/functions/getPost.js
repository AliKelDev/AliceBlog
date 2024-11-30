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
    // Construct the file path with .md extension if not present
    const filePath = `content/posts/${id}${id.endsWith('.md') ? '' : '.md'}`;

    // Local development
    if (process.env.NETLIFY_DEV) {
      const localPath = path.join(process.cwd(), filePath);
      const content = await fs.promises.readFile(localPath, 'utf8');
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
      path: filePath
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
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error fetching post',
        error: error.message,
        path: `content/posts/${id}${id.endsWith('.md') ? '' : '.md'}`
      })
    };
  }
};