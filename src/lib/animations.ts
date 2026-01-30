/**
 * Form Animation Utilities
 * Provides reusable animation variants for form transitions, field focus, and error states
 * Ensures animations don't interfere with accessibility
 */

import { Variants } from 'framer-motion';

/**
 * Container animation for form sections
 * Fades in and slides up with staggered children
 */
export const formContainerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

/**
 * Individual field animation
 * Fades in and slides up
 */
export const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

/**
 * Field focus animation
 * Adds a subtle highlight effect when field is focused
 */
export const fieldFocusVariants: Variants = {
  unfocused: {
    boxShadow: '0 0 0 0px rgba(255, 107, 53, 0)',
    transition: { duration: 0.2 },
  },
  focused: {
    boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.1)',
    transition: { duration: 0.2 },
  },
};

/**
 * Error shake animation
 * Shakes the field when validation fails
 */
export const errorShakeVariants: Variants = {
  shake: {
    x: [0, -8, 8, -8, 8, 0],
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
  still: {
    x: 0,
  },
};

/**
 * Error message animation
 * Fades in and slides down
 */
export const errorMessageVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

/**
 * Step completion animation
 * Scales up and fades in
 */
export const stepCompletionVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

/**
 * Form section transition (fade/slide)
 * Used when transitioning between form sections
 */
export const formSectionVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

/**
 * Button animation
 * Scales on hover and click
 */
export const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

/**
 * Touch feedback animation
 * Provides visual feedback on touch/tap for mobile devices
 * Combines scale and opacity changes
 */
export const touchFeedbackVariants: Variants = {
  rest: { scale: 1, opacity: 1 },
  tap: {
    scale: 0.95,
    opacity: 0.9,
    transition: { duration: 0.1 },
  },
};

/**
 * Touch ripple animation
 * Creates a ripple effect on touch
 */
export const touchRippleVariants: Variants = {
  initial: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 2,
    opacity: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/**
 * Interactive element touch state
 * Provides visual feedback for interactive elements on touch
 */
export const interactiveTouchVariants: Variants = {
  idle: { backgroundColor: 'transparent' },
  active: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    transition: { duration: 0.15 },
  },
};

/**
 * List item animation (for team members)
 * Slides in from left
 */
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * Progress bar animation
 * Smoothly animates width changes
 */
export const progressBarVariants: Variants = {
  initial: { width: 0 },
  animate: (width: number) => ({
    width: `${width}%`,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

/**
 * Accessibility-safe animation configuration
 * Respects prefers-reduced-motion for users who prefer minimal animations
 */
export const getAccessibleAnimationVariants = (
  variants: Variants,
  prefersReducedMotion: boolean
): Variants => {
  if (!prefersReducedMotion) {
    return variants;
  }

  // Return instant animations for users who prefer reduced motion
  return Object.entries(variants).reduce(
    (acc, [key, value]) => {
      if (typeof value === 'object' && value !== null && 'transition' in value) {
        acc[key] = {
          ...value,
          transition: { duration: 0 },
        };
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as Variants
  );
};

/**
 * Hook to detect user's motion preference
 */
export const usePrefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
