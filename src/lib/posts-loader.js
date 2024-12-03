// src/lib/posts-loader.js
import { Buffer } from 'buffer'
globalThis.Buffer = Buffer

// Using Vite's import.meta.glob for automatic file discovery
const postFiles = import.meta.glob('/content/posts/*.mdx', {
  eager: true 
})

const formatDate = (dateString) => {
  if (!dateString) {
    console.log('No date string provided')
    return new Date().toISOString()
  }
  try {
    console.log('Formatting date:', dateString)
    const [year, month, day] = dateString.split('-').map(num => num.padStart(2, '0'))
    const date = new Date(`${year}-${month}-${day}T12:00:00.000Z`)
    return date.toISOString()
  } catch (error) {
    console.error('Error formatting date:', error)
    return new Date().toISOString() // Fallback to current date
  }
}

// Get and sort all posts
export async function getPosts() {
  try {
    const posts = Object.entries(postFiles).map(([path, module]) => {
      console.log('Processing file:', path)
      console.log('Module content:', module)
      
      const id = path.replace('/content/posts/', '').replace('.mdx', '')
      const meta = module.meta || {} // Changed from frontmatter to meta
      
      console.log('Meta:', meta)
      
      return {
        id,
        ...meta,
        component: module.default,
        date: formatDate(meta.date) // Changed from frontmatter.date to meta.date
      }
    })

    return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (error) {
    console.error('Error loading posts:', error)
    return []
  }
}

// Get a single post by ID
export async function getPost(id) {
  try {
    const posts = await getPosts()
    return posts.find(post => post.id === id)
  } catch (error) {
    console.error('Error getting post:', error)
    return null
  }
}

// Get adjacent posts (previous and next)
export async function getAdjacentPosts(currentId) {
  try {
    const posts = await getPosts()
    const currentIndex = posts.findIndex(post => post.id === currentId)
    
    return {
      prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
      next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
    }
  } catch (error) {
    console.error('Error getting adjacent posts:', error)
    return { prev: null, next: null }
  }
}

// Get posts by tag
export async function getPostsByTag(tag) {
  try {
    const posts = await getPosts()
    return posts.filter(post => post.tags?.includes(tag))
  } catch (error) {
    console.error('Error getting posts by tag:', error)
    return []
  }
}

// Get all unique tags
export async function getAllTags() {
  try {
    const posts = await getPosts()
    const tags = new Set()
    
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag))
    })
    
    return Array.from(tags)
  } catch (error) {
    console.error('Error getting tags:', error)
    return []
  }
}