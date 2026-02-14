// LRU cache with TTL support.

type CacheEntry<T> = {
  value: T;
  expiresAt: number | null;
};

export class AdvancedCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  // Set cache value with optional TTL.

  set(key: string, value: T, ttlMs?: number) {
    const expiresAt = ttlMs ? Date.now() + ttlMs : null;

    if (this.store.has(key)) {
      this.store.delete(key);
    }

    this.store.set(key, { value, expiresAt });

    this.evictIfNeeded();
  }

  // Get cached value.

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    // Refresh LRU position.

    this.store.delete(key);
    this.store.set(key, entry);

    return entry.value;
  }

  // Delete cache key.

  delete(key: string) {
    this.store.delete(key);
  }

  // Clear all cache.

  clear() {
    this.store.clear();
  }

  // Remove oldest entries if over limit.

  private evictIfNeeded() {
    while (this.store.size > this.maxSize) {
      const oldestKey = this.store.keys().next().value;
      this.store.delete(oldestKey);
    }
  }

  // Snapshot stats.

  stats() {
    return {
      size: this.store.size,
      keys: [...this.store.keys()],
    };
  }
}
