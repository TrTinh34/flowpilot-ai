export type NotificationFailureKind = 'not_found';

export class NotificationFailure extends Error {
  constructor(
    public readonly kind: NotificationFailureKind,
    message: string,
  ) {
    super(message);
    this.name = 'NotificationFailure';
  }
}
