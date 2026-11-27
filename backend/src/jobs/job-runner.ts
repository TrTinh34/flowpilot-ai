import type { BackgroundWorker } from './outbox.worker.js';

export class JobRunner {
  constructor(private readonly workers: BackgroundWorker[]) {}

  start(): void {
    for (const worker of this.workers) {
      worker.start();
    }
  }

  async stop(): Promise<void> {
    await Promise.all(this.workers.map((worker) => worker.stop()));
  }
}
