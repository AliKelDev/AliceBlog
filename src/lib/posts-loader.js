// src/lib/posts-loader.js
import { Buffer } from 'buffer'
globalThis.Buffer = Buffer

// Using Vite's import.meta.glob for automatic file discovery
// Keep the recursive pattern
const postFiles = import.meta.glob('/content/posts/**/*.mdx', {
  eager: true 
})

const formatDate = (dateString) => {
  if (!dateString) {
    console.warn('No date string provided for post')
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
    console.log('Discovered post files:', Object.keys(postFiles))
    
    const posts = Object.entries(postFiles).map(([path, module]) => {
      console.log('Processing post:', path)
      console.log('Module content:', module)
      
      // Extract just the filename without extension for the ID
      const id = path
        .split('/')
        .pop()
        .replace('.mdx', '')
      
      const meta = module.meta || {}
      
      // Store the full path separately for internal use
      const fullPath = path
        .replace('/content/posts/', '')
        .replace(/^\//, '')
        .replace(/\.mdx$/, '')
      
      console.log('Post ID:', id)
      console.log('Full path:', fullPath)
      console.log('Meta:', meta)
      
      return {
        id,
        fullPath, // Keep the full path for reference
        ...meta,
        component: module.default,
        date: formatDate(meta.date)
      }
    })

    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date))
    console.log('Total posts found:', sortedPosts.length)
    console.log('Sorted posts:', sortedPosts.map(p => ({ id: p.id, date: p.date })))
    
    return sortedPosts
  } catch (error) {
    console.error('Error loading posts:', error)
    return []
  }
}

// Get a single post by ID
export async function getPost(id) {
  try {
    console.log('Getting post with ID:', id)
    const posts = await getPosts()
    // Match by ID (filename only)
    const post = posts.find(post => post.id === id)
    console.log('Found post:', post ? post.id : 'not found')
    return post
  } catch (error) {
    console.error('Error getting post:', error)
    return null
  }
}

// Get adjacent posts (previous and next)
export async function getAdjacentPosts(currentId) {
  try {
    console.log('Getting adjacent posts for:', currentId)
    const posts = await getPosts()
    const currentIndex = posts.findIndex(post => post.id === currentId)
    
    const adjacent = {
      prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
      next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
    }
    
    console.log('Adjacent posts:', {
      prev: adjacent.prev?.id || 'none',
      next: adjacent.next?.id || 'none'
    })
    
    return adjacent
  } catch (error) {
    console.error('Error getting adjacent posts:', error)
    return { prev: null, next: null }
  }
}

// Get posts by tag
export async function getPostsByTag(tag) {
  try {
    console.log('Getting posts for tag:', tag)
    const posts = await getPosts()
    const taggedPosts = posts.filter(post => post.tags?.includes(tag))
    console.log(`Found ${taggedPosts.length} posts with tag: ${tag}`)
    return taggedPosts
  } catch (error) {
    console.error('Error getting posts by tag:', error)
    return []
  }
}

// Get all unique tags
export async function getAllTags() {
  try {
    console.log('Getting all tags')
    const posts = await getPosts()
    const tags = new Set()
    
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag))
    })
    
    const allTags = Array.from(tags)
    console.log('Found tags:', allTags)
    return allTags
  } catch (error) {
    console.error('Error getting tags:', error)
    return []
  }
}