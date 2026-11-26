import type { Request, Response } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../../errors/app-error.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import { workspacePage } from '../workspace/workspace.schema.js';
import * as schema from './project.schema.js';
import * as service from './project.service.js';

function actorId(req: Request) {
  if (!req.auth)
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'A valid access token is required.');
  return req.auth.userId;
}

function parse<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success)
    throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Invalid project request.');
  return result.data;
}

export async function list(req: Request, res: Response) {
  const { workspaceId } = parse(schema.workspaceProjectParams, req.params);
  const { page, size } = parse(workspacePage, req.query);
  res.json(await service.getProjects(workspaceId, actorId(req), page, size));
}

export async function create(req: Request, res: Response) {
  const { workspaceId } = parse(schema.workspaceProjectParams, req.params);
  const input = parse(schema.createProjectBody, req.body);
  res.status(201).json({ data: await service.createProject(workspaceId, actorId(req), input) });
}

export async function update(req: Request, res: Response) {
  const { projectId } = parse(schema.projectParams, req.params);
  const input = parse(schema.updateProjectBody, req.body);
  res.json({ data: await service.updateProject(projectId, actorId(req), input) });
}

export async function members(req: Request, res: Response) {
  const { projectId } = parse(schema.projectParams, req.params);
  res.set('Cache-Control', 'no-store');
  res.json(await service.getProjectMembers(projectId, actorId(req)));
}

export async function addMember(req: Request, res: Response) {
  const { projectId } = parse(schema.projectParams, req.params);
  const input = parse(schema.addProjectMemberBody, req.body);
  res.status(201).json({ data: await service.addProjectMember(projectId, actorId(req), input) });
}
