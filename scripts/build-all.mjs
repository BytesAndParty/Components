// Combined build for the single Netlify deploy.
//
// Each app is built independently, then its output is assembled into ONE
// publish dir (./dist) under the subpath the launcher links to:
//
//   dist/            ← launcher  (base '/')            → /
//   dist/components/ ← components-showcase (base /components/)
//   dist/sections/   ← section-showcase  (base /sections/)
//   dist/shop/       ← vendure storefront (Astro base /shop via DEPLOY_SUBPATH)
//
// The base paths live in each app's own config; this script only orchestrates
// and copies. Run via `bun run build:all`.

import { execSync } from 'node:child_process'
import { existsSync, rmSync, mkdirSync, cpSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'dist')

/** @type {{ name: string, cwd: string, dist: string, dest: string, env?: Record<string,string> }[]} */
const apps = [
  { name: 'launcher',            cwd: 'launcher',                     dist: 'dist', dest: '.' },
  { name: 'components-showcase', cwd: 'components-showcase',          dist: 'dist', dest: 'components' },
  { name: 'section-showcase',    cwd: 'section-showcase',             dist: 'dist', dest: 'sections' },
  { name: 'vendure-storefront',  cwd: 'vendure-showcase/storefront',  dist: 'dist', dest: 'shop', env: { DEPLOY_SUBPATH: '/shop' } },
]

console.log('▸ cleaning', out)
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

for (const app of apps) {
  const cwd = path.join(root, app.cwd)
  console.log(`\n▸ building ${app.name}  (${app.cwd})`)
  execSync('bun run build', {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, ...app.env },
  })

  const from = path.join(cwd, app.dist)
  if (!existsSync(from)) {
    throw new Error(`build output missing: ${from}`)
  }
  const to = app.dest === '.' ? out : path.join(out, app.dest)
  console.log(`  → ${path.relative(root, from)}  ⇒  ${path.relative(root, to)}`)
  cpSync(from, to, { recursive: true })
}

console.log('\n✓ combined build assembled in ./dist')
