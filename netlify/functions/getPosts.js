import { Octokit } from '@octokit/rest';
import matter from 'gray-matter';

export const handler = async (event) => {
  try {
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
        .map(async file => {
          const { data: fileData } = await octokit.repos.getContent({
            owner: process.env.GITHUBOWNER,
            repo: process.env.GITHUBREPO,
            path: file.path
          });

          const content = Buffer.from(fileData.content, 'base64').toString();
          const { data } = matter(content);
          
          return {
            id: file.name.replace('.md', ''),
            title: data.title,
            date: data.date,
            description: data.description,
            thumbnail: data.thumbnail,
            tags: data.tags
          };
        })
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(posts)
    };
    
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error fetching posts',
        error: error.message,
        details: {
          name: error.name,
          stack: error.stack
        }
      })
    };
  }
};