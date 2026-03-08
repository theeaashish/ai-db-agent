import http from "http"
import { parse } from "url"

/* ----------------------------- Types ----------------------------- */

type Handler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  body?: any
) => Promise<void> | void

interface Route {
  method: string
  path: string
  handler: Handler
}

/* -------------------------- Simple Router ------------------------- */

class Router {
  private routes: Route[] = []

  register(method: string, path: string, handler: Handler) {
    this.routes.push({ method, path, handler })
  }

  find(method: string, path: string) {
    return this.routes.find(
      r => r.method === method && r.path === path
    )
  }
}

/* -------------------------- Rate Limiter -------------------------- */

class TokenBucketLimiter {
  private buckets = new Map<
    string,
    { tokens: number; lastRefill: number }
  >()

  constructor(
    private capacity: number,
    private refillRate: number
  ) {}

  allow(key: string) {
    const now = Date.now()

    let bucket = this.buckets.get(key)

    if (!bucket) {
      bucket = { tokens: this.capacity, lastRefill: now }
      this.buckets.set(key, bucket)
    }

    const elapsed = (now - bucket.lastRefill) / 1000
    const refill = elapsed * this.refillRate

    bucket.tokens = Math.min(
      this.capacity,
      bucket.tokens + refill
    )

    bucket.lastRefill = now

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1
      return true
    }

    return false
  }
}

/* --------------------------- Utilities ---------------------------- */

async function parseBody(
  req: http.IncomingMessage
): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = ""

    req.on("data", chunk => {
      data += chunk
    })

    req.on("end", () => {
      if (!data) return resolve(undefined)

      try {
        resolve(JSON.parse(data))
      } catch {
        reject(new Error("Invalid JSON"))
      }
    })
  })
}

function sendJSON(
  res: http.ServerResponse,
  status: number,
  data: any
) {
  res.writeHead(status, {
    "Content-Type": "application/json"
  })
  res.end(JSON.stringify(data))
}

/* ---------------------------- Storage ----------------------------- */

const users: { id: number; name: string }[] = []
let idCounter = 1

/* ----------------------------- Router ----------------------------- */

const router = new Router()

router.register("GET", "/users", async (_, res) => {
  sendJSON(res, 200, users)
})

router.register("POST", "/users", async (_, res, body) => {
  const user = {
    id: idCounter++,
    name: body.name
  }

  users.push(user)

  sendJSON(res, 201, user)
})

router.register("GET", "/health", async (_, res) => {
  sendJSON(res, 200, { status: "ok" })
})

/* ------------------------- Rate Limiter --------------------------- */

const limiter = new TokenBucketLimiter(20, 5)

/* --------------------------- HTTP Server -------------------------- */

const server = http.createServer(async (req, res) => {
  try {
    const { pathname } = parse(req.url || "", true)

    if (!pathname) {
      return sendJSON(res, 404, { error: "Not found" })
    }

    const ip = req.socket.remoteAddress || "unknown"

    if (!limiter.allow(ip)) {
      return sendJSON(res, 429, {
        error: "Too many requests"
      })
    }

    const route = router.find(req.method || "", pathname)

    if (!route) {
      return sendJSON(res, 404, {
        error: "Route not found"
      })
    }

    const body = await parseBody(req)

    console.log(`${req.method} ${pathname}`)

    await route.handler(req, res, body)
  } catch (err: any) {
    console.error(err)

    sendJSON(res, 500, {
      error: "Internal server error"
    })
  }
})

/* ---------------------------- Startup ----------------------------- */

const PORT = 3000

server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
