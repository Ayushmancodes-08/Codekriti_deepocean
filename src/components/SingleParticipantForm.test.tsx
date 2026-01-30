import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SingleParticipantForm } from './SingleParticipantForm';
import { RegistrationProvider } from '../contexts/RegistrationContext';

/**
 * Unit tests for SingleParticipantForm component
 * Tests specific examples and core functionality
 */
describe('SingleParticipantForm Component', () => {
  it('should render all required form fields', () => {
    render(
      <RegistrationProvider>
        <SingleParticipantForm />
      </RegistrationProvider>
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/college/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/student id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/branch/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
  });

  it('should display submit button', () => {
    render(
      <RegistrationProvider>
        <SingleParticipantForm />
      </RegistrationProvider>
    );

    expect(screen.getByRole('button', { name: /submit registration/i })).toBeInTheDocument();
  });

  it('should have correct input types', () => {
    render(
      <RegistrationProvider>
        <SingleParticipantForm />
      </RegistrationProvider>
    );

    const phoneInput = screen.getByLabelText(/phone number/i) as HTMLInputElement;
    expect(phoneInput.type).toBe('tel');

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(emailInput.type).toBe('email');
  });

  it('should render all select dropdowns', () => {
    render(
      <RegistrationProvider>
        <SingleParticipantForm />
      </RegistrationProvider>
    );

    expect(screen.getByRole('combobox', { name: /select your college/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /select your branch/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /select your year/i })).toBeInTheDocument();
  });

  it('should have accessibility attributes on inputs', () => {
    render(
      <RegistrationProvider>
        <SingleParticipantForm />
      </RegistrationProvider>
    );

    const nameInput = screen.getByLabelText(/full name/i);
    expect(nameInput).toHaveAttribute('aria-invalid', 'false');

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should display required field indicators', () => {
    render(
      <RegistrationProvider>
        <SingleParticipantForm />
      </RegistrationProvider>
    );

    const requiredIndicators = screen.getAllByText('*');
    expect(requiredIndicators.length).toBeGreaterThan(0);
  });

  it('should have proper form structure', () => {
    const { container } = render(
      <RegistrationProvider>
        <SingleParticipantForm />
      </RegistrationProvider>
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });
});
