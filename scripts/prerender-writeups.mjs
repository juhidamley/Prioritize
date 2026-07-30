// Build-time prerender: emit static, fully-crawlable HTML for each project
// writeup at dist/projects/<slug>/index.html. Runs after `vite build`.
//
// These pages are intentionally self-contained static documents (no SPA bundle)
// so that crawlers and answer engines see the complete text, metadata, and
// JSON-LD in the raw HTML source. "Last updated" is wired to the real file mtime
// of scripts/writeups.mjs.

import { writeups, SITE, AUTHOR } from './writeups.mjs';
import { mkdirSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');
const dataMtime = statSync(resolve(__dirname, 'writeups.mjs')).mtime;
const lastUpdated = dataMtime.toISOString().slice(0, 10); // YYYY-MM-DD

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function jsonLd(w) {
  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: w.name,
    url: `${SITE}/projects/${w.slug}`,
    description: w.description,
    applicationCategory: w.appCategory,
    operatingSystem: 'Web',
    programmingLanguage: w.languages,
    ...(w.repoUrl ? { codeRepository: w.repoUrl } : {}),
    author: {
      '@type': 'Person',
      name: AUTHOR,
      url: SITE,
      affiliation: {
        '@type': 'CollegeOrUniversity',
        name: 'Claremont McKenna College',
      },
    },
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: w.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE}/projects` },
      { '@type': 'ListItem', position: 3, name: w.name, item: `${SITE}/projects/${w.slug}` },
    ],
  };
  return [software, faq, breadcrumb]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n    ');
}

function renderSection(s) {
  let out = `<section>\n      <h2>${esc(s.h2)}</h2>\n`;
  if (s.body) out += `      <p>${esc(s.body)}</p>\n`;
  if (s.steps) {
    out += '      <ol>\n';
    for (const step of s.steps) out += `        <li>${esc(step)}</li>\n`;
    out += '      </ol>\n';
  }
  if (s.table) {
    out += '      <table>\n        <tbody>\n';
    for (const [k, v] of s.table) {
      out += `          <tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>\n`;
    }
    out += '        </tbody>\n      </table>\n';
  }
  out += '    </section>';
  return out;
}

function renderFaq(w) {
  let out = '<section>\n      <h2>Frequently asked questions</h2>\n';
  for (const f of w.faq) {
    out += `      <h3>${esc(f.q)}</h3>\n      <p>${esc(f.a)}</p>\n`;
  }
  out += '    </section>';
  return out;
}

const otherLinks = (slug) =>
  writeups
    .filter((w) => w.slug !== slug)
    .map((w) => `<a href="/projects/${w.slug}">${esc(w.name)}</a>`)
    .join(' · ');

function page(w) {
  const canonical = `${SITE}/projects/${w.slug}`;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(w.title)}</title>
    <meta name="description" content="${esc(w.description)}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/png" href="/juhistudioicon.png" />
    <meta name="theme-color" content="#000000" />
    <meta name="author" content="${esc(AUTHOR)}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${esc(w.title)}" />
    <meta property="og:description" content="${esc(w.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE}/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(w.title)}" />
    <meta name="twitter:description" content="${esc(w.description)}" />
    ${jsonLd(w)}
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0; background: #05050a; color: #d8d8e0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.65; -webkit-font-smoothing: antialiased;
      }
      a { color: #00ff41; text-decoration: none; }
      a:hover { text-decoration: underline; }
      .wrap { max-width: 760px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
      header.site { border-bottom: 1px solid #1c1c28; padding-bottom: 0.75rem; margin-bottom: 2rem;
        font-family: "Courier New", monospace; font-size: 0.85rem; }
      header.site a { color: #ffe169; }
      h1 { font-size: 2rem; line-height: 1.2; margin: 0 0 0.75rem; color: #fff;
        font-family: "Courier New", monospace; letter-spacing: 0.01em; }
      .lede { font-size: 1.2rem; color: #f0f0f5; margin: 0 0 1.25rem; }
      .meta { font-family: "Courier New", monospace; font-size: 0.8rem; color: #8a8a9a;
        margin: 0 0 2rem; }
      .meta a { color: #00ff41; }
      h2 { font-size: 1.3rem; margin: 2.25rem 0 0.6rem; color: #fff;
        font-family: "Courier New", monospace; border-left: 3px solid #00ff41; padding-left: 0.6rem; }
      h3 { font-size: 1.02rem; margin: 1.4rem 0 0.3rem; color: #ffe169; }
      p { margin: 0 0 1rem; }
      ol { padding-left: 1.3rem; } ol li { margin-bottom: 0.6rem; }
      table { width: 100%; border-collapse: collapse; margin: 0.5rem 0 1rem; font-size: 0.95rem; }
      th, td { text-align: left; vertical-align: top; padding: 0.5rem 0.6rem; border-bottom: 1px solid #1c1c28; }
      th[scope="row"] { color: #9a9aff; white-space: nowrap; width: 33%; font-weight: 600; }
      footer.site { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #1c1c28;
        font-family: "Courier New", monospace; font-size: 0.82rem; color: #8a8a9a; }
      footer.site a { color: #00ff41; }
      @media (max-width: 520px) { h1 { font-size: 1.6rem; } .lede { font-size: 1.05rem; } th[scope="row"] { width: 42%; } }
    </style>
  </head>
  <body>
    <div class="wrap">
      <header class="site">
        <a href="/">juhi.studio</a> / <a href="/projects">projects</a> / ${esc(w.name)}
      </header>
      <main>
        <article>
          <h1>${esc(w.name)}</h1>
          <p class="lede">${esc(w.lede)}</p>
          <p class="meta">
            ${[
              w.liveUrl ? `<a href="${w.liveUrl}">Live demo ↗</a>` : '',
              w.repoUrl ? `<a href="${w.repoUrl}">Source ↗</a>` : '',
              !w.liveUrl && !w.repoUrl ? `<a href="/research">See on Research ↗</a>` : '',
              `Last updated ${lastUpdated}`,
            ].filter(Boolean).join(' &nbsp;·&nbsp; ')}
          </p>
          <section>
            <h2>What it is</h2>
            <p>${esc(w.context)}</p>
          </section>
          ${w.sections.map(renderSection).join('\n          ')}
          ${renderFaq(w)}
        </article>
      </main>
      <footer class="site">
        By <a href="/">${esc(AUTHOR)}</a> · Claremont McKenna College ·
        More projects: ${otherLinks(w.slug)} · <a href="/projects">all projects</a>
      </footer>
    </div>
  </body>
</html>
`;
}

let count = 0;
for (const w of writeups) {
  const dir = resolve(distDir, 'projects', w.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, 'index.html'), page(w), 'utf8');
  count++;
  console.log(`  prerendered /projects/${w.slug} (last updated ${lastUpdated})`);
}
console.log(`prerender-writeups: wrote ${count} static writeup page(s).`);
