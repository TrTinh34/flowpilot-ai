import type { Logger } from 'pino';
import type { ProcessOutboxEvents } from '../modules/notification/index.js';

export interface BackgroundWorker {
  start(): void;
  stop(): Promise<void>;
}

export function createOutboxWorker(
  processor: ProcessOutboxEvents,
  logger: Pick<Logger, 'error' | 'debug'>,
  options: { intervalMs?: number; batchSize?: number } = {},
): BackgroundWorker & { pollOnce: () => Promise<void> } {
  const intervalMs = options.intervalMs ?? 2000;
  const batchSize = options.batchSize ?? 20;
  let timer: NodeJS.Timeout | undefined;
  let stopped = false;
  let inFlight: Promise<void> | undefined;

  async function pollOnce(): Promise<void> {
    if (inFlight) {
      await inFlight;
      return;
    }
    inFlight = (async () => {
      try {
        const result = await processor.execute(batchSize);
        if (result.processed > 0 || result.retried > 0 || result.failed > 0) {
          logger.debug({ outbox: result }, 'Processed outbox batch');
        }
      } catch (error) {
        logger.error({ err: error }, 'Outbox worker iteration failed');
      } finally {
        inFlight = undefined;
      }
    })();
    await inFlight;
  }

  function scheduleNext() {
    if (stopped) return;
    timer = setTimeout(() => {
      void pollOnce().finally(scheduleNext);
    }, intervalMs);
    timer.unref();
  }

  return {
    pollOnce,
    start() {
      if (timer) return;
      stopped = false;
      scheduleNext();
    },
    async stop() {
      stopped = true;
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      if (inFlight) {
        await inFlight;
      }
    },
  };
}
