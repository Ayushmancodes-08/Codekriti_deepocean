import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationProvider, useRegistration } from '../contexts/RegistrationContext';

// Test component that uses the registration context
const TestComponent = () => {
  const { formState, selectEvent } = useRegistration();
  
  return (
    <div>
      <div data-testid="current-event">{formState.selectedEvent || 'none'}</div>
      <div data-testid="current-step">{formState.currentStep}</div>
      <button onClick={() => selectEvent('algo-to-code')}>Select Algo</button>
      <button onClick={() => selectEvent('techmaze')}>Select TechMaze</button>
    </div>
  );
};

describe('StoneModal Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update registration context when event is selected', async () => {
    const user = userEvent.setup();
    render(
      <RegistrationProvider>
        <TestComponent />
      </RegistrationProvider>
    );

    expect(screen.getByTestId('current-event')).toHaveTextContent('none');
    expect(screen.getByTestId('current-step')).toHaveTextContent('event-selection');

    const algoButton = screen.getByText('Select Algo');
    await user.click(algoButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-event')).toHaveTextContent('algo-to-code');
      expect(screen.getByTestId('current-step')).toHaveTextContent('details');
    });
  });

  it('should handle team event selection', async () => {
    const user = userEvent.setup();
    render(
      <RegistrationProvider>
        <TestComponent />
      </RegistrationProvider>
    );

    const techmazeButton = screen.getByText('Select TechMaze');
    await user.click(techmazeButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-event')).toHaveTextContent('techmaze');
      expect(screen.getByTestId('current-step')).toHaveTextContent('details');
    });
  });

  it('should maintain event selection across multiple selections', async () => {
    const user = userEvent.setup();
    render(
      <RegistrationProvider>
        <TestComponent />
      </RegistrationProvider>
    );

    const algoButton = screen.getByText('Select Algo');
    await user.click(algoButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-event')).toHaveTextContent('algo-to-code');
    });

    const techmazeButton = screen.getByText('Select TechMaze');
    await user.click(techmazeButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-event')).toHaveTextContent('techmaze');
    });
  });
});
