# juhi.studio

Personal portfolio and app platform for Juhi Damley, with a Windows 95 / terminal retro aesthetic.

- **Hero (`/`)** — Conway's Game of Life canvas with an interactive terminal nav (type `help`).
- **Interior pages** — Win95-style windows (draggable, minimizable, with a live taskbar + Start menu) over an animated Mandelbrot background.
- **404** — a Blue Screen of Death, naturally.

## Structure

One repo, two Vite entry points ([vite.config.ts](vite.config.ts)):

| Entry | Source | Deployed at |
|---|---|---|
| `index.html` | `src/portfolio.tsx` → `src/pages/` | [juhi.studio](https://juhi.studio) |
| `ptz/index.html` | `src/main.tsx` → `src/app/` | [ptz.juhi.studio](https://ptz.juhi.studio) (Prioritize, a collaborative task manager on Supabase) |

Shared retro UI components live in `src/app/components/retro/`.

## Development

```sh
npm install
npm run dev     # local dev server
npm run build   # production build (emits dist/ and dist/ptz/)
```

Deployed on Vercel with an SPA rewrite ([vercel.json](vercel.json)).
