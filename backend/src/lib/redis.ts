import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

// ponytail: lazy in-memory fallback when Redis is unavailable
// Replace with real Redis in production — this is O(1) per key but no TTL, no persistence
const memoryStore = new Map<string, { value: string; expiresAt?: number }>();

function memoryGet(key: string): Promise<string | null> {
  const entry = memoryStore.get(key);
  if (!entry) return Promise.resolve(null);
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return Promise.resolve(null);
  }
  return Promise.resolve(entry.value);
}

function memorySet(key: string, value: string, ...args: any[]): Promise<string> {
  const ttlMs = args[0] === "EX" ? Number(args[1]) * 1000 : undefined;
  memoryStore.set(key, {
    value,
    expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
  });
  return Promise.resolve("OK");
}

function memoryDel(key: string): Promise<number> {
  return Promise.resolve(memoryStore.delete(key) ? 1 : 0);
}

const noopFn = (..._args: any[]) => Promise.resolve("OK");

let redisClient: Redis;

if (REDIS_URL) {
  redisClient = new Redis(REDIS_URL, { maxRetriesPerRequest: 3 });
  redisClient.on("error", (err) => console.error("Redis Client Error:", err.message));
} else {
  console.warn("⚠ No REDIS_URL set — using in-memory cache (not suitable for production)");
  redisClient = {
    get: memoryGet,
    set: memorySet,
    del: memoryDel,
    quit: () => Promise.resolve("OK"),
    on: noopFn,
  } as unknown as Redis;
}

export { redisClient as redis };
