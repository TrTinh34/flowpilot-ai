import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '@/App';

describe('App smoke test', () => {
  it('renders FlowPilot AI initialization page', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'FlowPilot AI' })).toBeInTheDocument();
    expect(screen.getByText('Frontend Status')).toBeInTheDocument();
    expect(screen.getByText('Backend Connection Status')).toBeInTheDocument();
    expect(screen.getByText('Database Connection Status')).toBeInTheDocument();
  });
});
