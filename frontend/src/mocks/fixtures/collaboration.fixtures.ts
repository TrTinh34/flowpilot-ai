export interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export const mockComments: Comment[] = [
  { id: 'c1', authorName: 'Alice', content: 'Looking into this, should have a fix by EOD.', createdAt: '2026-11-27T09:00:00Z' },
  { id: 'c2', authorName: 'Bob', content: '@Alice let me know if you need help with the auth piece.', createdAt: '2026-11-27T09:30:00Z' },
];

export interface Attachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export const mockAttachments: Attachment[] = [
  { id: 'att1', name: 'design-spec.pdf', size: 142000, mimeType: 'application/pdf', uploadedAt: '2026-11-26T15:00:00Z' },
  { id: 'att2', name: 'screenshot.png', size: 87000, mimeType: 'image/png', uploadedAt: '2026-11-27T08:00:00Z' },
];
