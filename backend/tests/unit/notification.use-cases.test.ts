import { describe, expect, it, vi } from 'vitest';
import type {
  NotificationRealtimePort,
  NotificationRepositoryPort,
  OutboxTransactionPort,
  OutboxUnitOfWorkPort,
} from '../../src/modules/notification/application/ports/notifications.port.js';
import { ListNotifications } from '../../src/modules/notification/application/use-cases/list-notifications.use-case.js';
import { MarkNotificationRead } from '../../src/modules/notification/application/use-cases/mark-notification-read.use-case.js';
import { ProcessOutboxEvents } from '../../src/modules/notification/application/use-cases/process-outbox.use-case.js';
import type {
  NotificationRecord,
  OutboxEventRecord,
} from '../../src/modules/notification/domain/notification.js';

describe('Notification use cases', () => {
  it('lists notifications with unreadCount and maps DTO timestamps', async () => {
    const createdAt = new Date('2026-11-28T03:00:00.000Z');
    const record: NotificationRecord = {
      id: 'noti-1',
      userId: 'user-1',
      projectId: 'proj-1',
      taskId: 'task-1',
      outboxEventId: 'out-1',
      type: 'TASK_MENTION',
      message: 'Alice mentioned you in "API"',
      readAt: null,
      createdAt,
    };
    const repository = {
      listForUser: vi
        .fn<NotificationRepositoryPort['listForUser']>()
        .mockResolvedValue({ items: [record], unreadCount: 1 }),
      markRead: vi.fn<NotificationRepositoryPort['markRead']>(),
      markAllRead: vi.fn<NotificationRepositoryPort['markAllRead']>(),
    };

    const result = await new ListNotifications(repository).execute({
      userId: 'user-1',
      page: 0,
      size: 20,
      unreadOnly: false,
    });

    expect(result).toEqual({
      data: [
        {
          id: 'noti-1',
          type: 'TASK_MENTION',
          message: 'Alice mentioned you in "API"',
          projectId: 'proj-1',
          taskId: 'task-1',
          isRead: false,
          readAt: null,
          createdAt: '2026-11-28T03:00:00.000Z',
        },
      ],
      page: 0,
      size: 20,
      unreadCount: 1,
    });
  });

  it('throws not_found when notification is missing or belongs to another user', async () => {
    const fixedNow = new Date('2026-11-28T03:10:00.000Z');
    const repository: NotificationRepositoryPort = {
      listForUser: vi.fn(),
      markRead: vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true),
      markAllRead: vi.fn().mockResolvedValue(3),
    };
    const useCase = new MarkNotificationRead(repository, () => fixedNow);

    await expect(useCase.execute({ notificationId: 'n1', userId: 'u2' })).rejects.toMatchObject({
      kind: 'not_found',
    });
    await expect(useCase.execute({ notificationId: 'n1', userId: 'u1' })).resolves.toBeUndefined();
    expect(repository.markRead).toHaveBeenCalledWith('n1', 'u1', fixedNow);
    await expect(useCase.markAll({ userId: 'u1' })).resolves.toBe(3);
  });
});

describe('ProcessOutboxEvents', () => {
  it('creates mention notifications, marks processed, and emits realtime after commit', async () => {
    const createdAt = new Date('2026-11-28T03:00:00.000Z');
    const event: OutboxEventRecord = {
      id: 'out-1',
      eventType: 'COMMENT_MENTIONED',
      payload: {
        commentId: 'c1',
        taskId: 't1',
        projectId: 'p1',
        authorId: 'u-author',
        recipientIds: ['u-1', 'U-1', 'u-2'],
      },
      status: 'PENDING',
      attempts: 0,
      nextAttemptAt: createdAt,
      createdAt,
    };
    const inserted: NotificationRecord[] = [
      {
        id: 'id-1',
        userId: 'u-1',
        projectId: 'p1',
        taskId: 't1',
        outboxEventId: 'out-1',
        type: 'TASK_MENTION',
        message: 'Alice mentioned you in "Build"',
        readAt: null,
        createdAt,
      },
    ];
    const tx: OutboxTransactionPort = {
      claimNextPending: vi.fn().mockResolvedValueOnce(event).mockResolvedValueOnce(null),
      findMentionContext: vi.fn().mockResolvedValue({ authorName: 'Alice', taskTitle: 'Build' }),
      createNotifications: vi.fn().mockResolvedValue(inserted),
      markProcessed: vi.fn(),
      markFailed: vi.fn(),
    };
    const uow: OutboxUnitOfWorkPort = {
      execute: (work) => work(tx),
      scheduleRetry: vi.fn(),
      markFailed: vi.fn(),
    };
    const realtime: NotificationRealtimePort = { emitToUser: vi.fn() };
    let seq = 0;

    const result = await new ProcessOutboxEvents(uow, () => `id-${++seq}`, realtime).execute(10);

    expect(result).toEqual({ processed: 1, failed: 0, retried: 0, notificationsCreated: 1 });
    expect(tx.createNotifications).toHaveBeenCalledWith([
      {
        id: 'id-1',
        userId: 'u-1',
        projectId: 'p1',
        taskId: 't1',
        outboxEventId: 'out-1',
        type: 'TASK_MENTION',
        message: 'Alice mentioned you in "Build"',
      },
      {
        id: 'id-2',
        userId: 'u-2',
        projectId: 'p1',
        taskId: 't1',
        outboxEventId: 'out-1',
        type: 'TASK_MENTION',
        message: 'Alice mentioned you in "Build"',
      },
    ]);
    expect(tx.markProcessed).toHaveBeenCalledWith('out-1');
    expect(realtime.emitToUser).toHaveBeenCalledTimes(1);
    expect(realtime.emitToUser).toHaveBeenCalledWith(
      'u-1',
      expect.objectContaining({ id: 'id-1', isRead: false }),
    );
  });

  it('schedules retry with backoff and marks FAILED once attempts reach max', async () => {
    const baseTime = new Date('2026-11-28T03:00:00.000Z');
    const event = (attempts: number): OutboxEventRecord => ({
      id: `out-${attempts}`,
      eventType: 'COMMENT_MENTIONED',
      payload: {
        commentId: 'c1',
        taskId: 't1',
        projectId: 'p1',
        authorId: 'u1',
        recipientIds: ['u2'],
      },
      status: 'PENDING',
      attempts,
      nextAttemptAt: baseTime,
      createdAt: baseTime,
    });
    const tx: OutboxTransactionPort = {
      claimNextPending: vi
        .fn()
        .mockResolvedValueOnce(event(0))
        .mockResolvedValueOnce(event(4))
        .mockResolvedValueOnce(null),
      findMentionContext: vi.fn().mockRejectedValue(new Error('DB glitch')),
      createNotifications: vi.fn(),
      markProcessed: vi.fn(),
      markFailed: vi.fn(),
    };
    const uow: OutboxUnitOfWorkPort = {
      execute: (work) => work(tx),
      scheduleRetry: vi.fn(),
      markFailed: vi.fn(),
    };

    const result = await new ProcessOutboxEvents(
      uow,
      () => 'id',
      undefined,
      () => baseTime,
    ).execute(10);

    expect(result).toEqual({ processed: 0, failed: 1, retried: 1, notificationsCreated: 0 });
    expect(uow.scheduleRetry).toHaveBeenCalledWith('out-0', 1, new Date(baseTime.getTime() + 2000));
    expect(uow.markFailed).toHaveBeenCalledWith('out-4', 5);
  });
});
