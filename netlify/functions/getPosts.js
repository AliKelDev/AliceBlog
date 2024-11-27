// src/api/getPosts.js
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getPosts() {
  try {
    const postsDirectory = path.join(process.cwd(), 'content/posts');
    const files = await fs.readdir(postsDirectory);
    
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async (file) => {
          const filePath = path.join(postsDirectory, file);
          const fileContent = await fs.readFile(filePath, 'utf8');
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
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}