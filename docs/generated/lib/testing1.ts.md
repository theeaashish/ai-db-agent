# AdvancedCache

This module implements an **LRU (Least Recently Used) cache** with support for **Time-To-Live (TTL)** expiration.

It maintains a fixed maximum size and automatically evicts the oldest (least recently accessed) entries when the limit is exceeded.

## `AdvancedCache<T>` Class

A generic class representing the LRU cache.

### Constructor

Initializes the cache with an optional maximum size.

```typescript
constructor(maxSize: number = 100)
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `maxSize` | `number` | The maximum number of entries the cache can hold. Defaults to 100. |

### Methods

#### `set(key: string, value: T, ttlMs?: number)`

Sets a value in the cache associated with a key. If the key already exists, it is updated and moved to the most recently used position.

```typescript
set(key: string, value: T, ttlMs?: number): void
```

- `ttlMs`: Optional time in milliseconds after which the entry should expire. If omitted, the entry never expires based on time.

#### `get(key: string): T | null`

Retrieves a value by key.

If the entry exists and has expired (based on `ttlMs`), it is automatically deleted, and `null` is returned. Accessing a valid entry refreshes its position in the LRU order.

```typescript
get(key: string): T | null
```

#### `delete(key: string)`

Removes a specific key-value pair from the cache.

```typescript
delete(key: string): void
```

#### `clear()`

Removes all entries from the cache.

```typescript
clear(): void
```

#### `stats()`

Returns a snapshot of the current cache statistics.

```typescript
stats(): {
  size: number;
  keys: string[];
}
```

### Private Methods

#### `evictIfNeeded()`

Internal method called after setting a new entry. If the cache size exceeds `this.maxSize`, it removes the least recently used entry until the size constraint is met.