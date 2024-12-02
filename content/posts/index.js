import { Buffer } from 'buffer'
globalThis.Buffer = Buffer

import GettingStartedPost, { meta as gettingStartedMeta } from './getting-started-with-react-and-vite.mdx'

// Map each post with its metadata and component
const posts = {
  'getting-started-with-react-and-vite': {
    id: 'getting-started-with-react-and-vite',
    title: gettingStartedMeta.title,
    date: new Date(gettingStartedMeta.date).toISOString(),
    description: gettingStartedMeta.description,
    tags: gettingStartedMeta.tags,
    thumbnail: gettingStartedMeta.thumbnail,
    component: GettingStartedPost
  }
}

// Export sorted posts array
export const allPosts = Object.values(posts).sort((a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB - dateA;
})