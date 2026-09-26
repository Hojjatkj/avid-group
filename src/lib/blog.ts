import { parseFrontmatter, type Frontmatter } from './markdown'

export interface BlogPost {
  data: Frontmatter
  content: string
}

// Eagerly load every markdown file under src/content/blog as raw text.
// `eager: true` avoids async imports (simpler call sites); the number of
// posts is small enough that this has no meaningful bundle-size cost.
const rawPosts = import.meta.glob('/src/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function loadPosts(): BlogPost[] {
  const posts = Object.values(rawPosts).map((raw) => {
    const { data, content } = parseFrontmatter(raw)
    return { data, content }
  })

  // Newest first. Falls back gracefully if a post is missing a date.
  posts.sort((a, b) => {
    const da = a.data.date ? new Date(a.data.date).getTime() : 0
    const db = b.data.date ? new Date(b.data.date).getTime() : 0
    return db - da
  })

  return posts
}

let cached: BlogPost[] | null = null

export function getAllPosts(): BlogPost[] {
  if (!cached) cached = loadPosts()
  return cached
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.data.slug === slug)
}

export function getLatestPosts(count: number): BlogPost[] {
  return getAllPosts().slice(0, count)
}

export function formatPersianDate(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }).format(
      new Date(dateStr)
    )
  } catch {
    return dateStr
  }
}
