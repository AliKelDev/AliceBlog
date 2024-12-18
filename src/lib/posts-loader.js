import { Buffer } from 'buffer'
globalThis.Buffer = Buffer

// Using Vite's import.meta.glob for automatic file discovery
const postFiles = import.meta.glob('/content/posts/**/*.mdx', {
  eager: true 
})

const formatDate = (dateString) => {
  if (!dateString) {
    console.warn('No date string provided for post')
    return new Date().toISOString()
  }
  try {
    const [year, month, day] = dateString.split('-').map(num => num.padStart(2, '0'))
    const date = new Date(`${year}-${month}-${day}T12:00:00.000Z`)
    return date.toISOString()
  } catch (error) {
    console.error('Error formatting date:', error)
    return new Date().toISOString()
  }
}

// Get and sort all posts
export async function getPosts() {
  try {
    const posts = Object.entries(postFiles).map(([path, module]) => {
      const id = path
        .split('/')
        .pop()
        .replace('.mdx', '')
      
      const meta = module.meta || {}
      
      // Process tags consistently
      const tags = (meta.tags || []).map(tag => tag.toLowerCase().trim())
      
      return {
        id,
        ...meta,
        tags,
        component: module.default,
        date: formatDate(meta.date)
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
    
    // If post not found or posts array is empty
    if (currentIndex === -1) {
      return { prev: null, next: null }
    }
    
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
  if (!tag) return []
  
  try {
    const posts = await getPosts()
    const normalizedTag = tag.toLowerCase().trim()
    return posts.filter(post => post.tags?.includes(normalizedTag))
  } catch (error) {
    console.error('Error getting posts by tag:', error)
    return []
  }
}

// Get all unique tags with counts
export async function getAllTags() {
  try {
    const posts = await getPosts()
    const tagCounts = new Map()
    
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })
    
    return Array.from(tagCounts.entries()).map(([tag, count]) => ({
      name: tag,
      count,
      slug: tag.replace(/\s+/g, '-')
    })).sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Error getting tags:', error)
    return []
  }
}

// Get related posts
export async function getRelatedPosts(currentPost, limit = 3) {
  if (!currentPost) return []
  
  try {
    const allPosts = await getPosts()
    
    return allPosts
      .filter(post => post.id !== currentPost.id) // Exclude current post
      .map(post => ({
        ...post,
        relevance: calculatePostRelevance(currentPost, post)
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting related posts:', error)
    return []
  }
}

// Calculate relevance between two posts
const calculatePostRelevance = (post1, post2) => {
  let score = 0
  
  // Tag matches
  const commonTags = post1.tags?.filter(tag => post2.tags?.includes(tag)) || []
  score += commonTags.length * 2
  
  // Date proximity (posts closer in time might be more related)
  const dateDistance = Math.abs(new Date(post1.date) - new Date(post2.date))
  const dateScore = 1 / (1 + dateDistance / (1000 * 60 * 60 * 24 * 30)) // Normalize by months
  score += dateScore
  
  return score
}

export default {
  getPosts,
  getPost,
  getAdjacentPosts,
  getPostsByTag,
  getAllTags,
  getRelatedPosts
}