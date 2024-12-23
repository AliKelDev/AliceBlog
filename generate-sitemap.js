import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import fs from 'fs'
import path from 'path'
import { Buffer } from 'buffer'
import { getPosts } from './src/lib/postLoader.js'  // Adjust path as needed

// Set up Buffer globally for sitemap package
globalThis.Buffer = Buffer

// Base routes
const baseRoutes = [
  '/',              // Home
  '/blog',          // Blog index
  '/contact'        // Contact
]

async function generateSitemap() {
  try {
    const sitemap = new SitemapStream({ hostname: 'https://aliceleiserblog.netlify.app' })

    // Get all blog posts
    const posts = await getPosts()
    
    // Create links array starting with base routes
    const links = baseRoutes.map(route => ({
      url: route,
      changefreq: route === '/' ? 'daily' : 'weekly',
      priority: (() => {
        switch(route) {
          case '/':
            return 1.0
          case '/blog':
            return 0.9
          case '/contact':
            return 0.7
          default:
            return 0.5
        }
      })()
    }))

    // Add blog post routes
    const postLinks = posts.map(post => ({
      url: `/blog/${post.id}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: post.date // Using the post's date as lastmod
    }))

    // Combine all links
    links.push(...postLinks)

    // Generate sitemap XML
    const data = await streamToPromise(Readable.from(links).pipe(sitemap))
    
    // Ensure build directory exists
    const buildDir = path.join(process.cwd(), 'dist')
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true })
    }

    // Write sitemap to build directory
    fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), data.toString())
    console.log('✅ Sitemap generated successfully!')
    console.log(`📝 Total URLs in sitemap: ${links.length}`)
    console.log(`🔗 Blog posts added: ${postLinks.length}`)
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

generateSitemap()