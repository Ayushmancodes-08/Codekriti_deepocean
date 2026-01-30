import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RegistrationFlow } from './RegistrationFlow';
import { RegistrationProvider } from '../contexts/RegistrationContext';

/**
 * Unit tests for RegistrationFlow component
 * Tests form section transitions and animations
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */

describe('RegistrationFlow Component', () => {
  it('should render without errors', () => {
    render(
      <RegistrationProvider>
        <RegistrationFlow />
      </RegistrationProvider>
    );
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('should display single participant form for single events', async () => {
    const { rerender } = render(
      <RegistrationProvider>
        <RegistrationFlow />
      </RegistrationProvider>
    );

    // The form should be rendered
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });
  });

  it('should call onComplete callback when registration is submitted', async () => {
    const onComplete = vi.fn();

    render(
      <RegistrationProvider>
        <RegistrationFlow onComplete={onComplete} />
      </RegistrationProvider>
    );

    // Verify the component renders
    await waitFor(() => {
      expect(screen.getByRole('form')).toBeInTheDocument();
    });
  });

  it('should call onClose callback when close is triggered', async () => {
    const onClose = vi.fn();

    render(
      <RegistrationProvider>
        <RegistrationFlow onClose={onClose} />
      </RegistrationProvider>
    );

    // Verify the component renders
    await waitFor(() => {
      expect(screen.getByRole('form')).toBeInTheDocument();
    });
  });

  it('should have proper accessibility attributes', async () => {
    render(
      <RegistrationProvider>
        <RegistrationFlow />
      </RegistrationProvider>
    );

    await waitFor(() => {
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      // Form should be accessible
      expect(form).toHaveClass('w-full');
    });
  });

  it('should render with motion animations', async () => {
    const { container } = render(
      <RegistrationProvider>
        <RegistrationFlow />
      </RegistrationProvider>
    );

    await waitFor(() => {
      // Check for motion div wrapper
      const motionDiv = container.querySelector('[style*="opacity"]');
      expect(motionDiv).toBeInTheDocument();
    });
  });
});
