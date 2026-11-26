import type { Request, Response } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../../errors/app-error.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import * as schema from './workspace.schema.js';
import * as service from './workspace.service.js';
import * as invitations from './workspace.invitation.js';

function actorId(req: Request) {
  if (!req.auth)
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'A valid access token is required.');
  return req.auth.userId;
}

function parse<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success)
    throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Invalid workspace request.');
  return result.data;
}

export async function list(req: Request, res: Response) {
  const { page, size } = parse(schema.workspacePage, req.query);
  res.json(await service.getWorkspaces(actorId(req), page, size));
}

export async function listMembers(req: Request, res: Response) {
  const { workspaceId } = parse(schema.workspaceParams, req.params);
  res.set('Cache-Control', 'no-store');
  res.json(await service.getWorkspaceMembers(workspaceId, actorId(req)));
}

export async function create(req: Request, res: Response) {
  const { name } = parse(schema.createWorkspaceBody, req.body);
  res.status(201).json({ data: await service.createWorkspace(actorId(req), name) });
}

export async function changeRole(req: Request, res: Response) {
  const { workspaceId, userId } = parse(schema.workspaceMemberParams, req.params);
  const { role } = parse(schema.updateRoleBody, req.body);
  res.json({ data: await service.changeMemberRole(workspaceId, actorId(req), userId, role) });
}

export async function remove(req: Request, res: Response) {
  const { workspaceId, userId } = parse(schema.workspaceMemberParams, req.params);
  await service.removeMember(workspaceId, actorId(req), userId);
  res.status(204).end();
}

export async function transfer(req: Request, res: Response) {
  const { workspaceId } = parse(schema.workspaceParams, req.params);
  const { userId } = parse(schema.transferOwnershipBody, req.body);
  res.json({ data: await service.transferOwnership(workspaceId, actorId(req), userId) });
}

export async function invite(req: Request, res: Response) {
  const { workspaceId } = parse(schema.workspaceParams, req.params);
  const input = parse(schema.inviteMemberBody, req.body);
  res.set('Cache-Control', 'no-store');
  res.status(201).json({ data: await invitations.inviteMember(workspaceId, actorId(req), input) });
}

export async function accept(req: Request, res: Response) {
  const { token } = parse(schema.acceptInvitationBody, req.body);
  res.json({ data: await invitations.acceptInvitation(actorId(req), token) });
}
