import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = __dirname
const pages = ['index.html', 'contact.html', 'newsletter.html']

function localRefs(doc) {
  const attrs = [...doc.querySelectorAll('[href], [src]')]
    .flatMap((el) => [el.getAttribute('href'), el.getAttribute('src')])
    .filter(Boolean)

  return attrs.filter(
    (ref) => ref !== '' && !ref.startsWith('http') && !ref.startsWith('mailto:') && ref !== '#',
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

  it('toutes les ressources locales (CSS, JS, images, liens de nav) existent', () => {
    const refs = localRefs(doc)
    expect(refs.length).toBeGreaterThan(0)
    for (const ref of refs) {
      expect(fs.existsSync(resolveLocal(ref)), `${ref} référencé dans ${page} est introuvable`).toBe(
        true,
      )
    }
  })
})
