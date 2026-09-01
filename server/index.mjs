// Minimal backend that actually runs the Playwright suite on demand and
// streams its real stdout/stderr to connected clients over SSE.
//
// Guardrails against abuse (this endpoint is publicly reachable):
//   - only one run at a time (in-memory lock)
//   - a cooldown between runs
//   - a hard timeout that kills a run if it hangs
import express from 'express'
import cors from 'cors'
import { spawn } from 'node:child_process'
import { readFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { flattenReport, summarize } from '../scripts/lib/flatten-report.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const LIVE_JSON_PATH = path.join(ROOT, 'test-results', 'live-run.json')

const PORT = Number(process.env.PORT) || 3001
const COOLDOWN_MS = 30_000
const MAX_RUNTIME_MS = 120_000
const MAX_BUFFER_LINES = 2000

// Set when the frontend is hosted separately (e.g. on Vercel) from this
// backend (e.g. on Render). ALLOWED_ORIGIN lets that frontend's origin call
// the API cross-origin; unset means same-origin only (the default when this
// server also serves the built frontend itself). PUBLIC_SITE_URL tells the
// live run which URL is actually "the site" to test — without it, a split
// deployment would end up testing this backend's own (static-only) origin
// instead of the real public frontend.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const PUBLIC_SITE_URL = process.env.PUBLIC_SITE_URL

let running = false
let currentChild = null
let lastEndedAt = 0
let buffer = []
const clients = new Set()

function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${data}\n\n`
  for (const res of clients) res.write(payload)
}

function pushLine(line) {
  buffer.push(line)
  if (buffer.length > MAX_BUFFER_LINES) buffer.shift()
  broadcast('line', line)
}

function statusPayload() {
  const cooldownRemainingMs = lastEndedAt ? Math.max(0, COOLDOWN_MS - (Date.now() - lastEndedAt)) : 0
  return JSON.stringify({ running, cooldownRemainingMs })
}

function startRun(selfBaseUrl) {
  running = true
  buffer = []
  broadcast('status', statusPayload())

  try {
    rmSync(LIVE_JSON_PATH, { force: true })
  } catch {
    /* fine if it never existed */
  }

  // shell: true is required on Windows to resolve npx.cmd. Safe here because
  // every argument is a fixed constant defined above — nothing from the
  // request (there's no user input at all on this route) ever reaches argv.
  // Two reporters: "line" for the human-readable log streamed below, "json"
  // (written to LIVE_JSON_PATH, not stdout) so the structured results table
  // in the Tests section can be populated from this very run once it ends.
  const child = spawn('npx', ['playwright', 'test', '--project=chromium', '--reporter=line,json'], {
    cwd: ROOT,
    shell: true,
    env: {
      ...process.env,
      PLAYWRIGHT_BASE_URL: selfBaseUrl,
      PLAYWRIGHT_JSON_OUTPUT_NAME: LIVE_JSON_PATH,
      FORCE_COLOR: '0',
    },
  })
  currentChild = child

  const onData = (chunk) => {
    for (const raw of chunk.toString('utf8').split(/\r?\n/)) {
      const line = raw.trimEnd()
      if (line) pushLine(line)
    }
  }
  child.stdout.on('data', onData)
  child.stderr.on('data', onData)

  const killTimer = setTimeout(() => {
    pushLine('[runner] tempo máximo excedido — encerrando processo.')
    child.kill('SIGKILL')
  }, MAX_RUNTIME_MS)

  child.on('close', (code) => {
    clearTimeout(killTimer)
    running = false
    lastEndedAt = Date.now()
    currentChild = null

    let meta = null
    let tests = null
    try {
      const report = JSON.parse(readFileSync(LIVE_JSON_PATH, 'utf8'))
      tests = flattenReport(report)
      meta = summarize(report, tests)
    } catch {
      // e.g. the run was killed before the json reporter could write its
      // output — the console log still shows what happened either way.
    }

    broadcast('done', JSON.stringify({ code, meta, tests }))
  })

  child.on('error', (err) => {
    clearTimeout(killTimer)
    pushLine(`[runner] erro ao iniciar o processo: ${err.message}`)
    running = false
    lastEndedAt = Date.now()
    currentChild = null
    broadcast('done', JSON.stringify({ code: -1 }))
  })
}

const app = express()

if (ALLOWED_ORIGINS.length > 0) {
  app.use(
    cors({
      origin: ALLOWED_ORIGINS,
      methods: ['GET', 'POST'],
    }),
  )
}

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.post('/api/run/start', (req, res) => {
  if (running) {
    return res.status(409).json({ error: 'already-running' })
  }
  const sinceEnded = lastEndedAt ? Date.now() - lastEndedAt : Infinity
  if (sinceEnded < COOLDOWN_MS) {
    return res.status(429).json({ error: 'cooldown', retryAfterMs: COOLDOWN_MS - sinceEnded })
  }
  const proto = req.headers['x-forwarded-proto'] || req.protocol
  const host = req.headers['x-forwarded-host'] || req.get('host')
  startRun(PUBLIC_SITE_URL || `${proto}://${host}`)
  res.status(202).json({ started: true })
})

app.get('/api/run/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  })
  res.write('\n')
  res.write(`event: status\ndata: ${statusPayload()}\n\n`)
  for (const line of buffer) res.write(`event: line\ndata: ${line}\n\n`)

  clients.add(res)
  req.on('close', () => clients.delete(res))
})

app.use(express.static(DIST))
app.use((_req, res) => res.sendFile(path.join(DIST, 'index.html')))

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`)
})
