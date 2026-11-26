export interface EmailProvider {
  assertAvailable(): void;
  sendWorkspaceInvitation(input: {
    email: string;
    token: string;
  }): Promise<{ previewUrl?: string }>;
}
