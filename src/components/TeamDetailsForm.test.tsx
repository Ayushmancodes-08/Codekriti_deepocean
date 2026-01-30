import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TeamDetailsForm } from './TeamDetailsForm';
import { RegistrationProvider } from '../contexts/RegistrationContext';

/**
 * Unit tests for TeamDetailsForm component
 * Tests specific examples and core functionality
 */
describe('TeamDetailsForm Component', () => {
  it('should render all required form fields', () => {
    render(
      <RegistrationProvider>
        <TeamDetailsForm />
      </RegistrationProvider>
    );

    expect(screen.getByLabelText(/team name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^college/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/leader name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should display team details header', () => {
    render(
      <RegistrationProvider>
        <TeamDetailsForm />
      </RegistrationProvider>
    );

    expect(screen.getByText(/team details/i)).toBeInTheDocument();
  });

  it('should display action buttons', () => {
    render(
      <RegistrationProvider>
        <TeamDetailsForm />
      </RegistrationProvider>
    );

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add team members/i })).toBeInTheDocument();
  });

  it('should have correct input types', () => {
    render(
      <RegistrationProvider>
        <TeamDetailsForm />
      </RegistrationProvider>
    );

    const phoneInput = screen.getByLabelText(/phone number/i) as HTMLInputElement;
    expect(phoneInput.type).toBe('tel');

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(emailInput.type).toBe('email');
  });

  it('should render college select dropdown', () => {
    render(
      <RegistrationProvider>
        <TeamDetailsForm />
      </RegistrationProvider>
    );

    expect(screen.getByRole('combobox', { name: /select your college/i })).toBeInTheDocument();
  });

  it('should have accessibility attributes on inputs', () => {
    render(
      <RegistrationProvider>
        <TeamDetailsForm />
      </RegistrationProvider>
    );

    const teamNameInput = screen.getByLabelText(/team name/i);
    expect(teamNameInput).toHaveAttribute('aria-invalid', 'false');

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should display required field indicators', () => {
    render(
      <RegistrationProvider>
        <TeamDetailsForm />
      </RegistrationProvider>
    );

    const requiredIndicators = screen.getAllByText('*');
    expect(requiredIndicators.length).toBeGreaterThan(0);
  });

  it('should have proper form structure', () => {
    const { container } = render(
      <RegistrationProvider>
        <TeamDetailsForm />
      </RegistrationProvider>
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should display team leader information section', () => {
    render(
      <RegistrationProvider>
        <TeamDetailsForm />
      </RegistrationProvider>
    );

    expect(screen.getByText(/team leader information/i)).toBeInTheDocument();
  });

  it('should have form fields organized in sections', () => {
    const { container } = render(
      <RegistrationProvider>
        <TeamDetailsForm />
      </RegistrationProvider>
    );

    const sections = container.querySelectorAll('div[class*="space-y"]');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('should accept onBack callback prop', () => {
    const onBack = vi.fn();
    render(
      <RegistrationProvider>
        <TeamDetailsForm onBack={onBack} />
      </RegistrationProvider>
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();
  });
});
