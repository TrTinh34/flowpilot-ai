import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Application error',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled application error:', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="mx-auto max-w-xl p-8">
          <h1 className="text-xl font-semibold">Application Error</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{this.state.message}</p>
        </main>
      );
    }
    return this.props.children;
  }
}
