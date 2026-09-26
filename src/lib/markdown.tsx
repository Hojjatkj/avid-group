import React, { createElement } from 'react'

/**
 * Tiny, dependency-free markdown utilities.
 *
 * This project has no markdown/frontmatter library installed and this
 * environment can't run `npm install`, so this file hand-rolls just
 * enough of both to support blog posts:
 *   - parseFrontmatter: reads simple `key: value` YAML-style frontmatter
 *   - renderMarkdown: converts a modest subset of markdown to JSX
 *     (headings, paragraphs, bold/italic, links, unordered/ordered lists,
 *     blockquotes, inline code, horizontal rules)
 *
 * It is NOT a full CommonMark implementation — if the blog's content
 * needs grow (tables, nested lists, footnotes, etc.), swap this for a
 * real package (e.g. `marked` + `gray-matter`) once npm access is back.
 */

export interface Frontmatter {
  title: string
  slug: string
  excerpt: string
  date: string
  author?: string
  category?: string
  coverImage?: string
  readMinutes?: number
  [key: string]: string | number | undefined
}

export function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) {
    return { data: {} as Frontmatter, content: raw.trim() }
  }

  const block = match[1]
  const content = raw.slice(match[0].length).trim()
  const data: Record<string, string | number> = {}

  block.split(/\r?\n/).forEach((line) => {
    const lineMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/)
    if (!lineMatch) return
    const key = lineMatch[1]
    let value: string | number = lineMatch[2].trim()
    // strip matching quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key === 'readMinutes' && /^\d+$/.test(value)) {
      value = Number(value)
    }
    data[key] = value
  })

  return { data: data as unknown as Frontmatter, content }
}

/** Renders a run of inline markdown (bold, italic, code, links) as JSX nodes. */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  // Order matters: links, then bold, then italic, then inline code.
  const pattern = /(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const token = match[0]
    const key = `${keyPrefix}-${i++}`

    if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        nodes.push(
          <a
            key={key}
            href={linkMatch[2]}
            className="text-teal-600 underline underline-offset-2 hover:text-teal-700"
            target={linkMatch[2].startsWith('http') ? '_blank' : undefined}
            rel={linkMatch[2].startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {linkMatch[1]}
          </a>
        )
      }
    } else if (token.startsWith('**')) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*')) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>)
    } else if (token.startsWith('`')) {
      nodes.push(
        <code key={key} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[0.9em]" dir="ltr">
          {token.slice(1, -1)}
        </code>
      )
    }
    lastIndex = pattern.lastIndex
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

/** Converts a markdown document body into JSX blocks (headings, paragraphs, lists, etc). */
export function renderMarkdown(markdown: string): React.ReactNode {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i++
      continue
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr key={key++} className="my-8 border-slate-200" />)
      i++
      continue
    }

    // Headings
    const heading = line.match(/^(#{1,4})\s+(.*)$/)
    if (heading) {
      const level = heading[1].length
      const text = heading[2]
      const cls =
        level === 1
          ? 'text-3xl font-bold text-slate-900 mt-10 mb-4'
          : level === 2
            ? 'text-2xl font-bold text-slate-900 mt-8 mb-3'
            : level === 3
              ? 'text-xl font-bold text-slate-900 mt-6 mb-2'
              : 'text-lg font-bold text-slate-900 mt-5 mb-2'
      const tagName = `h${Math.min(level + 1, 4)}`
      blocks.push(
        createElement(tagName, { key, className: cls }, renderInline(text, `h${key++}`))
      )
      i++
      continue
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      blocks.push(
        <blockquote
          key={key++}
          className="border-r-4 border-teal-300 pr-4 my-5 text-slate-600 italic"
        >
          {quoteLines.join(' ')}
        </blockquote>
      )
      continue
    }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''))
        i++
      }
      blocks.push(
        <ul key={key++} className="list-disc pr-6 my-4 space-y-1.5 text-slate-700 leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ul${key}-${idx}`)}</li>
          ))}
        </ul>
      )
      continue
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''))
        i++
      }
      blocks.push(
        <ol key={key++} className="list-decimal pr-6 my-4 space-y-1.5 text-slate-700 leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ol${key}-${idx}`)}</li>
          ))}
        </ol>
      )
      continue
    }

    // Paragraph — collect until blank line
    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,4}\s|[-*]\s|\d+\.\s|>\s?|---+$)/.test(lines[i])) {
      paraLines.push(lines[i])
      i++
    }
    blocks.push(
      <p key={key++} className="text-slate-700 leading-8 my-4 text-justify">
        {renderInline(paraLines.join(' '), `p${key}`)}
      </p>
    )
  }

  return blocks
}
