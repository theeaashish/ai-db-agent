# JobQueue Implementation (`lib/testing3.ts`)

This file implements an advanced in-memory job queue system that supports job processing with configurable concurrency limits and automatic retries upon failure.

## Types and Interfaces

### `JobStatus`
Defines the possible states of a job:
```typescript
type JobStatus = "pending" | "processing" | "completed" | "failed";
```

### `Job<T>`
Represents a single job item stored in the queue.
| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the job. |
| `name` | `string` | The name of the registered processor for this job. |
| `payload` | `T` | The data associated with the job. |
| `status` | `JobStatus` | Current status of the job. |
| `attempts` | `number` | Number of times the job has been attempted. |
| `maxAttempts` | `number` | Maximum number of times the job can be retried. |
| `createdAt` | `Date` | Timestamp when the job was created. |
| `updatedAt` | `Date` | Timestamp when the job status was last updated. |
| `error?` | `string` | Error message if the job failed. |

### `Processor<T>`
A function signature for a job handler that accepts the job payload and returns a `Promise<void>`.
```typescript
type Processor<T> = (payload: T) => Promise<void>;
```

### `QueueOptions`
Configuration options for the `JobQueue`.
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `concurrency` | `number` | `2` | Maximum number of jobs that can be processed simultaneously. |
| `retryDelayMs` | `number` | `2000` | Delay in milliseconds before retrying a failed job. |

## `JobQueue` Class

Manages the lifecycle of jobs, including registration, addition, processing, and status tracking.

### Constructor

Initializes the queue with specified options, setting default concurrency (2) and retry delay (2000ms) if not provided.

```typescript
constructor(options?: QueueOptions)
```

### Methods

#### `register<T>(name: string, processor: Processor<T>): void`
Registers a processing function for a specific job name. Throws an error if a processor for that name already exists.

#### `add<T>(name: string, payload: T, maxAttempts?: number): Job<T>`
Adds a new job to the queue.
- Requires a processor to be registered under `name`.
- Assigns a unique ID, sets status to `"pending"`, and initializes attempt count.
- Automatically triggers `processNext()` to start execution if capacity allows.

#### `getJob(id: string): Job | null`
Retrieves a job object from the internal map using its ID. Returns `null` if not found.

#### `getStats(): { total: number, completed: number, failed: number, pending: number, processing: number }`
Returns a snapshot of the current job distribution across all statuses.

### Private Methods

#### `processNext(): void`
The core scheduling mechanism.
1. Checks if the current active job count is below the configured `concurrency`.
2. Searches for the next available `"pending"` job.
3. If found, increments `activeCount`, starts `processJob`, and ensures `activeCount` is decremented and `processNext` is called again upon completion (success or failure).

#### `processJob(job: Job): Promise<void>`
Executes the registered processor for the given job.
1. Sets job status to `"processing"` and increments `attempts`.
2. **On Success:** Sets status to `"completed"`.
3. **On Failure:**
    - Records the error message.
    - If `attempts` is less than `maxAttempts`, sets status back to `"pending"` and schedules a retry using `setTimeout` based on `retryDelayMs`.
    - If `maxAttempts` is reached, sets status to `"failed"`.