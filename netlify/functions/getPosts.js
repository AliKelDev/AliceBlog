const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { Octokit } = require('@octokit/rest');

exports.handler = async (event) => {
  try {
    // Local development
    if (process.env.NETLIFY_DEV) {
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
      
      const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      return {
        statusCode: 200,
        body: JSON.stringify(sortedPosts)
      };
    }

    // Production - using GitHub API
    const octokit = new Octokit({
      auth: process.env.GITHUBTOKEN
    });

    const { data: files } = await octokit.repos.getContent({
      owner: process.env.GITHUBOWNER,
      repo: process.env.GITHUBREPO,
      path: 'content/posts'
    });

    const posts = await Promise.all(
      files
        .filter(file => file.name.endsWith('.md'))
        .map(async (file) => {
          const { data: fileData } = await octokit.repos.getContent({
            owner: process.env.GITHUBOWNER,
            repo: process.env.GITHUBREPO,
            path: file.path
          });

          const fileContent = Buffer.from(fileData.content, 'base64').toString();
          const { data, content } = matter(fileContent);
          
          return {
            id: file.name.replace('.md', ''),
            title: data.title,
            date: data.date,
            description: data.description,
            thumbnail: data.thumbnail,
            tags: data.tags,
            body: content
          };
        })
    );

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