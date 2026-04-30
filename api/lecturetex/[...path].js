// Vercel serverless proxy — forwards /api/* to the MCP server with the API key injected.
// The key lives in Vercel env vars and never reaches the browser.
export default async function handler(req, res) {
  const MCP_URL = process.env.MCP_SERVER_URL
  const API_KEY = process.env.MCP_API_KEY

  if (!MCP_URL) {
    return res.status(500).json({ error: 'MCP_SERVER_URL not configured in Vercel env vars' })
  }

  // Parse path from req.url — strip /lecturetex/api or /api prefix.
  // Vercel may pass the pre-rewrite URL, post-rewrite URL, or req.query.path
  // depending on how the route was matched, so we handle all three.
  const parsed = new URL(req.url, 'http://x')
  let mcpPath = parsed.pathname
    .replace(/^\/lecturetex\/api/, '')
    .replace(/^\/api/, '')
  if (!mcpPath || mcpPath === '') mcpPath = '/'

  // Fall back to req.query.path if URL parsing produced nothing useful
  if (mcpPath === '/' && req.query.path) {
    const parts = Array.isArray(req.query.path) ? req.query.path : [req.query.path]
    mcpPath = '/' + parts.join('/')
  }

  const targetUrl = MCP_URL.replace(/\/$/, '') + mcpPath + parsed.search

  // Forward headers — inject API key, strip host
  const headers = {}
  for (const [k, v] of Object.entries(req.headers)) {
    if (k === 'host') continue
    headers[k] = v
  }
  headers['x-api-key'] = API_KEY || ''

  // Collect body (bodyParser is disabled so req is a raw stream)
  let body = null
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    body = Buffer.concat(chunks)
  }

  try {
    const upstream = await fetch(targetUrl, { method: req.method, headers, body })

    for (const [k, v] of upstream.headers.entries()) {
      if (k === 'transfer-encoding' || k === 'connection') continue
      res.setHeader(k, v)
    }
    res.status(upstream.status)
    res.send(Buffer.from(await upstream.arrayBuffer()))
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
}
