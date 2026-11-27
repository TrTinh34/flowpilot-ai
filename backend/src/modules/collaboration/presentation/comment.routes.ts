import { Router, type RequestHandler } from 'express';
import { z } from 'zod';
import type { AddTaskComment, ListTaskComments } from '../application/use-cases/task-comments.js';
import { pagination, parse, present, taskActor } from './collaboration-http.js';

const body = z.strictObject({
  body: z
    .string()
    .trim()
    .min(1)
    .refine((text) => !text.includes('\0')),
  mentionIds: z.array(z.uuid()).max(100),
});

export function createCommentRouter(
  list: ListTaskComments,
  add: AddTaskComment,
  authenticate: RequestHandler,
) {
  const router = Router({ mergeParams: true });
  router.get('/', authenticate, async (req, res) => {
    try {
      res.json(await list.execute({ ...taskActor(req), ...parse(pagination, req.query) }));
    } catch (error) {
      present(error);
    }
  });
  router.post('/', authenticate, async (req, res) => {
    try {
      const comment = await add.execute({ ...taskActor(req), ...parse(body, req.body) });
      res.status(201).json({ data: comment });
    } catch (error) {
      present(error);
    }
  });
  return router;
}
