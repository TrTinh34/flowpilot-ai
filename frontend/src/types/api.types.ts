export interface ApiErrorResponse {
  code: string;
  message: string;
  requestId: string;
}

export type ServiceState = 'up' | 'down';

export interface HealthCheckResponse {
  status: 'ok' | 'degraded';
  services: {
    api: ServiceState;
    database: ServiceState;
  };
}
