// Advanced in-memory job queue with retry + concurrency control.

type JobStatus = "pending" | "processing" | "completed" | "failed";

export type Job<T = unknown> = {
  id: string;
  name: string;
  payload: T;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  error?: string;
};

type Processor<T> = (payload: T) => Promise<void>;

type QueueOptions = {
  concurrency?: number;
  retryDelayMs?: number;
};

export class JobQueue {
  private jobs: Map<string, Job> = new Map();
  private processors: Map<string, Processor<any>> = new Map();
  private activeCount = 0;

  private concurrency: number;
  private retryDelayMs: number;

  constructor(options?: QueueOptions) {
    this.concurrency = options?.concurrency ?? 2;
    this.retryDelayMs = options?.retryDelayMs ?? 2000;
  }

  // Register processor for job type.

  register<T>(name: string, processor: Processor<T>) {
    if (this.processors.has(name)) {
      throw new Error(`Processor already registered for ${name}`);
    }

    this.processors.set(name, processor);
  }

  // Add job to queue.

  add<T>(name: string, payload: T, maxAttempts = 3): Job<T> {
    if (!this.processors.has(name)) {
      throw new Error(`No processor registered for ${name}`);
    }

    const job: Job<T> = {
      id: crypto.randomUUID(),
      name,
      payload,
      status: "pending",
      attempts: 0,
      maxAttempts,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.jobs.set(job.id, job);
    this.processNext();

    return job;
  }

  // Internal worker trigger.

  private async processNext() {
    if (this.activeCount >= this.concurrency) return;

    const nextJob = [...this.jobs.values()].find(
      (job) => job.status === "pending"
    );

    if (!nextJob) return;

    this.activeCount++;
    this.processJob(nextJob)
      .finally(() => {
        this.activeCount--;
        this.processNext();
      });
  }

  // Execute job.

  private async processJob(job: Job) {
    const processor = this.processors.get(job.name);
    if (!processor) return;

    job.status = "processing";
    job.updatedAt = new Date();
    job.attempts++;

    try {
      await processor(job.payload);

      job.status = "completed";
      job.updatedAt = new Date();
    } catch (error) {
      job.error = (error as Error).message;
      job.updatedAt = new Date();

      if (job.attempts >= job.maxAttempts) {
        job.status = "failed";
      } else {
        job.status = "pending";
        setTimeout(() => this.processNext(), this.retryDelayMs);
      }
    }
  }

  // Fetch job by id.

  getJob(id: string) {
    return this.jobs.get(id) ?? null;
  }

  // Get stats snapshot.

  getStats() {
    const values = [...this.jobs.values()];

    return {
      total: values.length,
      completed: values.filter((j) => j.status === "completed").length,
      failed: values.filter((j) => j.status === "failed").length,
      pending: values.filter((j) => j.status === "pending").length,
      processing: values.filter((j) => j.status === "processing").length,
    };
  }
}
