import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventSelection from './EventSelection';

/**
 * Unit tests for EventSelection component
 * Tests specific examples and edge cases
 */
describe('EventSelection Component', () => {
  it('should render all event cards', () => {
    const mockOnEventSelect = vi.fn();
    render(
      <EventSelection
        onEventSelect={mockOnEventSelect}
        showCloseButton={false}
      />
    );

    // Check that all event names are rendered
    expect(screen.getByText('Algo-to-Code')).toBeInTheDocument();
    expect(screen.getByText('Designathon')).toBeInTheDocument();
    expect(screen.getByText('TechMaze')).toBeInTheDocument();
    expect(screen.getByText('Dev Xtreme')).toBeInTheDocument();
  });

  it('should display event descriptions', () => {
    const mockOnEventSelect = vi.fn();
    render(
      <EventSelection
        onEventSelect={mockOnEventSelect}
        showCloseButton={false}
      />
    );

    expect(screen.getByText('Individual coding competition')).toBeInTheDocument();
    expect(screen.getByText('Individual design competition')).toBeInTheDocument();
    expect(screen.getByText('Team-based tech challenge')).toBeInTheDocument();
    expect(screen.getByText('Team-based development competition')).toBeInTheDocument();
  });

  it('should show participant type information', () => {
    const mockOnEventSelect = vi.fn();
    render(
      <EventSelection
        onEventSelect={mockOnEventSelect}
        showCloseButton={false}
      />
    );

    // Check for individual event indicators (there are 2 individual events)
    const individualEventTexts = screen.getAllByText('Individual Event');
    expect(individualEventTexts).toHaveLength(2);

    // Check for team event indicators with member counts
    expect(screen.getByText('Team Event • 1-3 members')).toBeInTheDocument();
    expect(screen.getByText('Team Event • 3-6 members')).toBeInTheDocument();
  });

  it('should call onEventSelect when an event is clicked', async () => {
    const mockOnEventSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <EventSelection
        onEventSelect={mockOnEventSelect}
        showCloseButton={false}
      />
    );

    const algoToCodeButton = screen.getByRole('button', {
      name: /select algo-to-code event/i,
    });

    await user.click(algoToCodeButton);

    expect(mockOnEventSelect).toHaveBeenCalledWith('algo-to-code');
    expect(mockOnEventSelect).toHaveBeenCalledTimes(1);
  });

  it('should show close button when showCloseButton is true', () => {
    const mockOnEventSelect = vi.fn();
    const mockOnClose = vi.fn();

    render(
      <EventSelection
        onEventSelect={mockOnEventSelect}
        onClose={mockOnClose}
        showCloseButton={true}
      />
    );

    const closeButton = screen.getByRole('button', {
      name: /close event selection/i,
    });

    expect(closeButton).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const mockOnEventSelect = vi.fn();
    const mockOnClose = vi.fn();
    const user = userEvent.setup();

    render(
      <EventSelection
        onEventSelect={mockOnEventSelect}
        onClose={mockOnClose}
        showCloseButton={true}
      />
    );

    const closeButton = screen.getByRole('button', {
      name: /close event selection/i,
    });

    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should display custom title when provided', () => {
    const mockOnEventSelect = vi.fn();
    const customTitle = 'Choose Your Challenge';

    render(
      <EventSelection
        onEventSelect={mockOnEventSelect}
        title={customTitle}
        showCloseButton={false}
      />
    );

    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('should highlight selected event', async () => {
    const mockOnEventSelect = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <EventSelection
        onEventSelect={mockOnEventSelect}
        selectedEvent={null}
        showCloseButton={false}
      />
    );

    // Rerender with selected event
    rerender(
      <EventSelection
        onEventSelect={mockOnEventSelect}
        selectedEvent="algo-to-code"
        showCloseButton={false}
      />
    );

    const algoToCodeButton = screen.getByRole('button', {
      name: /select algo-to-code event/i,
    });

    // Check that the button has aria-pressed="true"
    expect(algoToCodeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should render helper text', () => {
    const mockOnEventSelect = vi.fn();
    render(
      <EventSelection
        onEventSelect={mockOnEventSelect}
        showCloseButton={false}
      />
    );

    expect(
      screen.getByText('Select an event to proceed with registration')
    ).toBeInTheDocument();
  });
});
