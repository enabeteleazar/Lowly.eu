import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = __dirname
const pages = ['index.html', 'contact.html', 'newsletter.html']
const vercelConfig = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf-8'))

function localRefs(doc) {
  const attrs = [...doc.querySelectorAll('[href], [src]')]
    .flatMap((el) => [el.getAttribute('href'), el.getAttribute('src')])
    .filter(Boolean)

  return attrs.filter(
    (ref) => ref !== '' && !ref.startsWith('http') && !ref.startsWith('mailto:') && !ref.startsWith('#'),
  )
}

function resolveLocal(ref) {
  // Les pages mélangent chemins relatifs ("assets/...") et racine ("/assets/...") ;
  // le site étant à plat (aucune sous-page), les deux se résolvent depuis la racine.
  return path.join(root, ref.replace(/^\//, ''))
}

describe.each(pages)('%s', (page) => {
  const doc = new JSDOM(fs.readFileSync(path.join(root, page), 'utf-8')).window.document

  it('a un titre et une meta charset', () => {
    expect(doc.title.trim().length).toBeGreaterThan(0)
    expect(doc.querySelector('meta[charset]')).not.toBeNull()
  })

  it('déclare une URL canonique sur le domaine et le chemin public', () => {
    const canonical = doc.querySelector('link[rel="canonical"]')

    expect(canonical).not.toBeNull()
    expect(canonical.href).toMatch(/^https:\/\/lowly\.eu\//)
    expect(canonical.href).not.toMatch(/\.html$/)
  })

  it('toutes les ressources locales (CSS, JS, images, liens de nav) existent', () => {
    const refs = localRefs(doc)
    expect(refs.length).toBeGreaterThan(0)
    for (const ref of refs) {
      expect(fs.existsSync(resolveLocal(ref)), `${ref} référencé dans ${page} est introuvable`).toBe(
        true,
      )
    }
  })

  it('les liens internes et ancres pointent vers une destination existante', () => {
    for (const link of doc.querySelectorAll('a[href]')) {
      const href = link.getAttribute('href')
      if (href.startsWith('#')) {
        expect(doc.getElementById(href.slice(1)), `${href} dans ${page}`).not.toBeNull()
      } else if (!href.startsWith('http') && !href.startsWith('mailto:')) {
        const localPath = href.split(/[?#]/, 1)[0]
        if (localPath) {
          expect(fs.existsSync(resolveLocal(localPath)), `${href} dans ${page}`).toBe(true)
        }
      }
    }
  })
})

describe('navigation mobile', () => {
  it('ferme le menu et synchronise aria-expanded après un clic ou Échap', () => {
    const dom = new JSDOM(fs.readFileSync(path.join(root, 'contact.html'), 'utf-8'), {
      runScripts: 'outside-only',
    })
    dom.window.eval(fs.readFileSync(path.join(root, 'assets/js/main.js'), 'utf-8'))

    const toggle = dom.window.document.querySelector('.nav-toggle')
    const nav = dom.window.document.querySelector('#site-nav')

    toggle.click()
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(nav.classList.contains('is-open')).toBe(true)

    nav.querySelector('a').click()
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(nav.classList.contains('is-open')).toBe(false)

    toggle.click()
    dom.window.document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape' }))
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(dom.window.document.activeElement).toBe(toggle)
    dom.window.close()
  })
})

describe('configuration Vercel', () => {
  it('ne redirige pas les chemins gérés par cleanUrls vers leurs versions .html', () => {
    expect(vercelConfig.cleanUrls).toBe(true)
    expect(vercelConfig.redirects).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: '/contact' }),
        expect.objectContaining({ source: '/newsletter' }),
      ]),
    )

    for (const redirect of vercelConfig.redirects) {
      expect(redirect.destination).not.toMatch(/\.html$/)
    }
  })

  it('n’impose pas un cache immutable aux ressources statiques non versionnées', () => {
    const assetHeader = vercelConfig.headers
      .find((entry) => entry.source === '/assets/(.*)')
      .headers.find((header) => header.key === 'Cache-Control')

    expect(assetHeader.value).not.toContain('immutable')
  })
})
