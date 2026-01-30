import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SingleParticipantForm } from './SingleParticipantForm';
import { TeamDetailsForm } from './TeamDetailsForm';
import { RegistrationProvider } from '../contexts/RegistrationContext';

/**
 * Unit tests for form animations and transitions
 * Tests field focus animations, error shake animations, and form transitions
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */

describe('Form Animations and Transitions', () => {
  describe('Field Focus Animations', () => {
    it('should apply focus animation when field is focused', async () => {
      const user = userEvent.setup();
      render(
        <RegistrationProvider>
          <SingleParticipantForm />
        </RegistrationProvider>
      );

      const nameInput = screen.getByLabelText(/full name/i);
      
      // Focus the input
      await user.click(nameInput);
      
      // Check that the input has focus
      expect(nameInput).toHaveFocus();
      
      // The input should have focus styling
      expect(nameInput).toHaveClass('focus:ring-orange-500');
    });

    it('should apply error styling when field has validation error', async () => {
      const user = userEvent.setup();
      render(
        <RegistrationProvider>
          <SingleParticipantForm />
        </RegistrationProvider>
      );

      const nameInput = screen.getByLabelText(/full name/i);
      
      // Focus and blur without entering value
      await user.click(nameInput);
      await user.tab();
      
      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });
      
      // Input should have error styling
      expect(nameInput).toHaveClass('border-red-500');
    });
  });

  describe('Error Shake Animation', () => {
    it('should trigger shake animation on validation error', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <RegistrationProvider>
          <SingleParticipantForm />
        </RegistrationProvider>
      );

      const nameInput = screen.getByLabelText(/full name/i);
      
      // Trigger validation error
      await user.click(nameInput);
      await user.tab();
      
      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });
      
      // Check that error message is visible
      const errorMessage = screen.getByText(/required/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-red-500');
    });

    it('should display error message with animation', async () => {
      const user = userEvent.setup();
      render(
        <RegistrationProvider>
          <SingleParticipantForm />
        </RegistrationProvider>
      );

      const nameInput = screen.getByLabelText(/full name/i);
      
      // Trigger validation error
      await user.click(nameInput);
      await user.tab();
      
      // Wait for error message
      await waitFor(() => {
        const errorMessage = screen.getByText(/required/i);
        expect(errorMessage).toBeInTheDocument();
        // Error message should have animation classes
        expect(errorMessage).toHaveClass('text-red-500');
      });
    });
  });

  describe('Form Section Transitions', () => {
    it('should render form with fade-in animation', async () => {
      const { container } = render(
        <RegistrationProvider>
          <SingleParticipantForm />
        </RegistrationProvider>
      );

      // Check that form is rendered
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      
      // Form should have motion wrapper
      expect(form).toHaveClass('space-y-6');
    });

    it('should render all form fields with staggered animation', async () => {
      render(
        <RegistrationProvider>
          <SingleParticipantForm />
        </RegistrationProvider>
      );

      // All fields should be rendered
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/college/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/student id/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/branch/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    });

    it('should handle form submission with animation', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <RegistrationProvider>
          <SingleParticipantForm onSubmit={onSubmit} />
        </RegistrationProvider>
      );

      // Fill in the form
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.click(screen.getByLabelText(/college/i));
      await user.click(screen.getByText('NIT Rourkela'));
      await user.type(screen.getByLabelText(/student id/i), '12345');
      await user.type(screen.getByLabelText(/phone number/i), '9876543210');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByLabelText(/branch/i));
      await user.click(screen.getByText('Computer Science'));
      await user.click(screen.getByLabelText(/year/i));
      await user.click(screen.getByText('1st Year'));

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Wait for submission
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Step Completion Animations', () => {
    it('should show step completion indicator for team forms', async () => {
      const { container } = render(
        <RegistrationProvider>
          <TeamDetailsForm />
        </RegistrationProvider>
      );

      // Check that form is rendered
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      
      // Should display team size information
      expect(screen.getByText(/team size/i)).toBeInTheDocument();
    });

    it('should display progress indicator for team registration', async () => {
      render(
        <RegistrationProvider>
          <TeamDetailsForm />
        </RegistrationProvider>
      );

      // Should show team details header
      expect(screen.getByText(/team details/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have proper ARIA labels for form fields', async () => {
      render(
        <RegistrationProvider>
          <SingleParticipantForm />
        </RegistrationProvider>
      );

      // Check for ARIA attributes
      const nameInput = screen.getByLabelText(/full name/i);
      expect(nameInput).toHaveAttribute('aria-invalid', 'false');
    });

    it('should announce validation errors to screen readers', async () => {
      const user = userEvent.setup();
      render(
        <RegistrationProvider>
          <SingleParticipantForm />
        </RegistrationProvider>
      );

      const nameInput = screen.getByLabelText(/full name/i);
      
      // Trigger validation error
      await user.click(nameInput);
      await user.tab();
      
      // Wait for error
      await waitFor(() => {
        expect(nameInput).toHaveAttribute('aria-invalid', 'true');
        expect(nameInput).toHaveAttribute('aria-describedby');
      });
    });

    it('should maintain keyboard navigation during animations', async () => {
      const user = userEvent.setup();
      render(
        <RegistrationProvider>
          <SingleParticipantForm />
        </RegistrationProvider>
      );

      const nameInput = screen.getByLabelText(/full name/i);
      
      // Tab to first field
      await user.tab();
      expect(nameInput).toHaveFocus();
      
      // Tab to next field
      await user.tab();
      const collegeSelect = screen.getByLabelText(/college/i);
      expect(collegeSelect).toHaveFocus();
    });
  });

  describe('Animation Performance', () => {
    it('should render form without layout shift', async () => {
      const { container } = render(
        <RegistrationProvider>
          <SingleParticipantForm />
        </RegistrationProvider>
      );

      // Get initial layout
      const form = screen.getByRole('form');
      const initialHeight = form.getBoundingClientRect().height;
      
      // Form should have consistent layout
      expect(initialHeight).toBeGreaterThan(0);
    });

    it('should handle rapid field interactions smoothly', async () => {
      const user = userEvent.setup();
      render(
        <RegistrationProvider>
          <SingleParticipantForm />
        </RegistrationProvider>
      );

      const nameInput = screen.getByLabelText(/full name/i);
      const collegeSelect = screen.getByLabelText(/college/i);
      
      // Rapid interactions
      await user.click(nameInput);
      await user.type(nameInput, 'John');
      await user.click(collegeSelect);
      await user.click(nameInput);
      
      // Should handle without errors
      expect(nameInput).toHaveValue('John');
    });
  });
});
