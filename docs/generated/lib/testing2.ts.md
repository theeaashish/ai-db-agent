# JobQueue Implementation (`lib/testing2.ts`)

This file implements an advanced in-memory job queue system that supports concurrency control and automatic job retries upon failure.

## Types and Interfaces

### `JobStatus`
Defines the possible states of a job within the queue.

```typescript
type JobStatus = "pending" | "processing" | "completed" | "failed";
```

### `Job<T>`
Represents a single unit of work stored in the queue.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the job. |
| `name` | `string` | The name of the registered processor to execute. |
| `payload` | `T` | The data required by the processor. |
| `status` | `JobStatus` | Current status of the job. |
| `attempts` | `number` | Number of times the job has been attempted. |
| `maxAttempts` | `number` | Maximum number of times the job can be retried. |
| `createdAt` | `Date` | Timestamp when the job was created. |
| `updatedAt` | `Date` | Timestamp of the last status change. |
| `error?` | `string` | Error message if the job failed. |

### `Processor<T>`
A function signature for a job handler that accepts the job payload and returns a `Promise<void>`.

```typescript
type Processor<T> = (payload: T) => Promise<void>;
```

### `QueueOptions`
Configuration options for initializing the `JobQueue`.

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `concurrency` | `number` | `2` | Maximum number of jobs that can run simultaneously. |
| `retryDelayMs` | `number` | `2000` | Delay in milliseconds before retrying a failed job. |

## `JobQueue` Class

Manages the lifecycle of jobs, including registration, addition, processing, and status tracking.

### Constructor

Initializes the queue with specified concurrency and retry delay settings.

```typescript
constructor(options?: QueueOptions);
```

### Methods

#### `register<T>(name: string, processor: Processor<T>): void`

Registers a processing function for a specific job name. Throws an error if a processor for that name already exists.

#### `add<T>(name: string, payload: T, maxAttempts?: number): Job<T>`

Adds a new job to the queue.

- **`name`**: Must correspond to a registered processor.
- **`payload`**: The data passed to the processor.
- **`maxAttempts`**: Optional. Overrides the default maximum attempts (defaults to 3 if not specified during job creation, though the context implies default is set during `add`).

This method immediately triggers `processNext()` to attempt execution if concurrency limits allow.

#### `getJob(id: string): Job | null`

Retrieves a job object from the queue by its ID. Returns `null` if not found.

#### `getStats(): { total: number, completed: number, failed: number, pending: number, processing: number }`

Returns a snapshot of the current job counts categorized by status.

### Private Methods

#### `processNext(): void`

The internal worker trigger. Checks if the active job count is below the configured concurrency limit. If space is available and pending jobs exist, it selects the next pending job and starts executing it via `processJob()`. It recursively calls itself upon completion of a job to check for more work.

#### `processJob(job: Job): Promise<void>`

Executes the registered processor for the given job.

1. Sets the job status to `"processing"` and increments `attempts`.
2. Executes the processor function.
3. **On Success**: Sets status to `"completed"`.
4. **On Failure**:
    - Records the error message.
    - If `attempts` meets `maxAttempts`, sets status to `"failed"`.
    - Otherwise, sets status back to `"pending"` and schedules `processNext()` after `retryDelayMs` to attempt a retry.