# Hackathon Website Upgrade - Design Document

## Overview

This design document outlines a comprehensive upgrade to the hackathon website, transforming it into a premium, immersive experience with 3D animations, optimized performance, and a sophisticated dynamic registration system. The architecture leverages modern React patterns, Three.js for 3D elements, Framer Motion for animations, and shadcn/ui components for consistent UI.

**Key Design Principles:**
- Premium, cohesive visual experience with modern typography
- Physics-based 3D animations using Three.js
- Dynamic, responsive forms that adapt to event selection
- Performance-first approach with lazy loading and optimization
- Accessibility-compliant throughout
- Mobile-first responsive design

---

## Architecture

### Technology Stack

**Frontend Framework:**
- React 18+ with TypeScript
- Vite for fast build and HMR
- TailwindCSS for styling

**3D & Animation:**
- Three.js for 3D stone modal and jellyfish logo
- React Three Fiber for React-Three.js integration
- Framer Motion for UI animations and transitions
- Cannon-es for physics simulation

**UI Components & Forms:**
- shadcn/ui for base components (buttons, inputs, selects, dialogs)
- React Hook Form for form state management
- Zod for schema validation
- Radix UI primitives (underlying shadcn/ui)

**Performance & Optimization:**
- Lazy loading for images and videos
- Code splitting with React.lazy
- Image optimization with WebP and responsive formats
- Video optimization with adaptive bitrate selection

**State Management:**
- React Context API for registration state
- Zustand for global UI state (optional, lightweight alternative)

### Component Architecture

```
App
├── Header (Navbar with Jellyfish Logo)
├── HeroSection (with optimized video background)
├── AboutSection
├── EventsSection
├── RegisterSection (with "Register Now" button)
├── Footer
├── 3D Elements
│   ├── JellyfishLogo (Three.js component)
│   ├── StoneModal (Three.js 3D boulder with physics)
│   └── BubbleEffects (Particle system)
└── RegistrationFlow
    ├── EventSelector
    ├── SingleParticipantForm
    ├── TeamDetailsForm
    └── TeamMembersForm
```

### Data Flow

1. User clicks "Register Now" → Triggers 3D Stone Modal entrance animation
2. Stone Modal displays event selection interface
3. User selects event → Form dynamically adapts based on event type
4. Single participant events → Show individual form
5. Team events → Show team details form, then member forms
6. Form submission → Validation, confirmation, and data persistence

---

## Components and Interfaces

### 1. Jellyfish Logo Component

**Purpose:** Animated, scalable jellyfish logo for branding

**Features:**
- 3D model rendered with Three.js
- Subtle floating animation with tentacle movement
- Hover effects with enhanced animation
- Responsive scaling based on viewport
- SVG fallback for non-WebGL browsers

**Props:**
```typescript
interface JellyfishLogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  interactive?: boolean;
  className?: string;
}
```

### 2. 3D Stone Modal Component

**Purpose:** Immersive registration entry point with physics-based animation

**Features:**
- 3D boulder/stone rendered with Three.js
- Physics simulation: gravity, bounce, settle animation
- Event selection interface integrated into stone
- Smooth entrance and exit animations
- Fully responsive and touch-friendly
- Accessibility: keyboard navigation, screen reader support

**Animation Sequence:**
1. Stone appears from top with gravity effect
2. Bounces on landing with decreasing amplitude
3. Settles into center position
4. Content fades in as stone settles
5. On close: stone animates away with reverse physics

**Props:**
```typescript
interface StoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventSelect: (event: EventType) => void;
}
```

### 3. Enhanced Bubble Effects Component

**Purpose:** Dynamic, physics-based bubble particle system

**Features:**
- Canvas-based particle system for performance
- Physics: gravity, collision, bounce, fade
- Responsive to viewport size
- 60 FPS optimization with requestAnimationFrame
- Hover interaction with bubbles
- Configurable density and animation speed

**Bubble Physics:**
- Gravity pulls bubbles downward
- Boundary collision with bounce
- Fade out at edges
- Size variation for depth perception
- Color gradient based on position

### 4. Dynamic Registration Form System

**Purpose:** Adaptive form that changes based on event selection

**Event Types:**
```typescript
type EventType = 'algo-to-code' | 'designathon' | 'techmaze' | 'dev-xtreme';

interface EventConfig {
  name: string;
  type: 'single' | 'team';
  minParticipants: number;
  maxParticipants: number;
  description: string;
}

const eventConfigs: Record<EventType, EventConfig> = {
  'algo-to-code': {
    name: 'Algo-to-Code',
    type: 'single',
    minParticipants: 1,
    maxParticipants: 1,
    description: 'Individual coding competition'
  },
  'designathon': {
    name: 'Designathon',
    type: 'single',
    minParticipants: 1,
    maxParticipants: 1,
    description: 'Individual design competition'
  },
  'techmaze': {
    name: 'TechMaze',
    type: 'team',
    minParticipants: 1,
    maxParticipants: 3,
    description: 'Team-based tech challenge'
  },
  'dev-xtreme': {
    name: 'Dev Xtreme',
    type: 'team',
    minParticipants: 3,
    maxParticipants: 6,
    description: 'Team-based development competition'
  }
};
```

### 5. Single Participant Form

**Purpose:** Simplified form for individual event registration

**Fields:**
- Name (text, required)
- College (text/select, required)
- Student ID (text, required)
- Phone Number (tel, required, validation)
- Email (email, required, validation)
- Branch (select dropdown, required)
- Year (select dropdown, required)

**Validation:**
- Real-time field validation with visual feedback
- Phone number format validation
- Email format validation
- Required field indicators

### 6. Team Registration Forms

**Team Details Form:**
- Team Name (text, required)
- College (text/select, required)
- Team Leader Name (text, required)
- Team Leader Phone (tel, required)
- Team Leader Email (email, required)
- Display: "Add X more members" indicator

**Team Member Form (Repeatable):**
- Name (text, required)
- College (text/select, required)
- Student ID (text, required)
- Phone Number (tel, required)
- Email (email, required)
- Branch (select dropdown, required)
- Year (select dropdown, required)
- Actions: Edit, Remove

**Member List Display:**
- Card-based layout showing all added members
- Edit/Remove buttons for each member
- Progress indicator: "X of Y members added"

### 7. Video Optimization Component

**Purpose:** Adaptive video playback based on device capabilities

**Features:**
- Device capability detection (bandwidth, screen size, GPU)
- Multiple video quality versions (480p, 720p, 1080p)
- Lazy loading for off-screen videos
- Intersection Observer for viewport detection
- Pause when not visible, resume when visible
- Mobile-optimized formats (H.264, VP9)
- Fallback to static image on unsupported devices

**Implementation:**
```typescript
interface VideoOptimizationProps {
  sources: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  poster: string;
  autoPlay?: boolean;
  loop?: boolean;
}
```

### 8. Responsive Layout System

**Breakpoints:**
- Mobile: < 640px (vertical stack, touch-optimized)
- Tablet: 640px - 1024px (two-column layouts)
- Desktop: > 1024px (full multi-column layouts)

**Responsive Behavior:**
- Fluid typography scaling
- Flexible spacing and padding
- Touch target sizes: minimum 44x44px on mobile
- Adaptive image sizes with srcset
- Flexible grid layouts with CSS Grid

---

## Data Models

### Registration Data Structure

```typescript
interface SingleParticipantRegistration {
  eventType: 'algo-to-code' | 'designathon';
  participant: {
    name: string;
    college: string;
    studentId: string;
    phoneNumber: string;
    email: string;
    branch: string;
    year: string;
  };
  submittedAt: Date;
  confirmationId: string;
}

interface TeamRegistration {
  eventType: 'techmaze' | 'dev-xtreme';
  team: {
    name: string;
    college: string;
    leader: {
      name: string;
      phoneNumber: string;
      email: string;
    };
  };
  members: Array<{
    name: string;
    college: string;
    studentId: string;
    phoneNumber: string;
    email: string;
    branch: string;
    year: string;
  }>;
  submittedAt: Date;
  confirmationId: string;
}

type RegistrationData = SingleParticipantRegistration | TeamRegistration;
```

### Form State Management

```typescript
interface RegistrationFormState {
  currentStep: 'event-selection' | 'details' | 'members' | 'confirmation';
  selectedEvent: EventType | null;
  formData: Partial<RegistrationData>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isComplete: boolean;
}
```

---

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Event Selection Determines Form Type

**For any** event selection, the form displayed should match the event's participant type (single vs. team).

**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

### Property 2: Single Participant Form Completeness

**For any** single participant event registration, all required fields (name, college, student ID, phone, email, branch, year) must be present and validated before submission is allowed.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

### Property 3: Team Member Count Enforcement

**For any** team event, the number of registered members must be within the event's participant range (TechMaze: 1-3, Dev Xtreme: 3-6).

**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 10.1, 10.2, 10.3, 10.4, 10.5**

### Property 4: Form Validation Round Trip

**For any** valid registration data, serializing to form state and deserializing back should produce equivalent data.

**Validates: Requirements 8.2, 9.2, 10.2**

### Property 5: 3D Stone Modal Animation Completion

**For any** stone modal trigger, the animation sequence (entrance, settle, content fade-in) should complete within 2 seconds and leave the modal in a stable, interactive state.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

### Property 6: Video Playback Optimization

**For any** video element, when the element is not in the viewport, playback should be paused; when it enters the viewport, playback should resume.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

### Property 7: Bubble Effects Performance

**For any** bubble particle system, the animation should maintain 60 FPS on devices with GPU acceleration and gracefully degrade on lower-end devices.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 8: Responsive Layout Consistency

**For any** viewport size, the layout should adapt to the appropriate breakpoint (mobile, tablet, desktop) and maintain visual hierarchy and readability.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 9: Accessibility Navigation

**For any** interactive element, keyboard navigation should be possible, and screen readers should announce the element's purpose and state.

**Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5**

### Property 10: Premium UI Consistency

**For any** section of the website, typography, spacing, and color scheme should be consistent with the design system.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

---

## Error Handling

### Form Validation Errors

**Field-Level Validation:**
- Real-time validation with immediate feedback
- Error messages displayed below field
- Visual indicators (red border, error icon)
- Prevent form submission if validation fails

**Error Messages:**
```typescript
const validationMessages = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  minLength: 'Must be at least {min} characters',
  maxLength: 'Must not exceed {max} characters',
  teamSizeInvalid: 'Team size must be between {min} and {max} members',
};
```

### Network & Submission Errors

- Retry mechanism for failed submissions
- User-friendly error messages
- Fallback to local storage if submission fails
- Confirmation of successful submission

### 3D Rendering Fallbacks

- WebGL detection with graceful degradation
- SVG/Canvas fallbacks for 3D elements
- Static images for unsupported browsers
- Performance monitoring and optimization

### Video Playback Errors

- Fallback to poster image if video fails to load
- Retry mechanism for failed video loads
- Graceful degradation to lower quality versions
- Error logging for debugging

---

## Testing Strategy

### Unit Testing

**Form Components:**
- Test field validation logic
- Test form state transitions
- Test error message display
- Test conditional field rendering based on event type

**Data Models:**
- Test registration data serialization/deserialization
- Test validation schemas
- Test data transformation functions

**Utility Functions:**
- Test device capability detection
- Test video quality selection logic
- Test responsive breakpoint calculations

### Property-Based Testing

**Property 1: Event Selection Determines Form Type**
- Generate random event selections
- Verify form type matches event configuration
- Test all event types

**Property 2: Single Participant Form Completeness**
- Generate random form data
- Verify all required fields are present
- Test validation logic across all field types

**Property 3: Team Member Count Enforcement**
- Generate random team sizes
- Verify member count is within event limits
- Test boundary conditions (min/max)

**Property 4: Form Validation Round Trip**
- Generate random valid registration data
- Serialize to form state
- Deserialize back to registration data
- Verify equivalence

**Property 5: 3D Stone Modal Animation Completion**
- Trigger modal animation
- Measure animation duration
- Verify modal is interactive after animation
- Test on multiple device types

**Property 6: Video Playback Optimization**
- Create mock viewport scenarios
- Trigger video visibility changes
- Verify playback state matches visibility
- Test with multiple video elements

**Property 7: Bubble Effects Performance**
- Run bubble animation for 10 seconds
- Measure frame rate
- Verify FPS >= 60 on capable devices
- Test graceful degradation on low-end devices

**Property 8: Responsive Layout Consistency**
- Generate random viewport sizes
- Verify layout adapts to correct breakpoint
- Test visual hierarchy maintenance
- Verify readability at all sizes

**Property 9: Accessibility Navigation**
- Test keyboard navigation through all interactive elements
- Verify ARIA labels and roles
- Test with screen reader simulation
- Verify focus management

**Property 10: Premium UI Consistency**
- Verify typography consistency across sections
- Check spacing and padding consistency
- Verify color scheme adherence
- Test visual hierarchy

### Integration Testing

- Test complete registration flow (event selection → form → submission)
- Test 3D modal integration with form
- Test video background with other page elements
- Test responsive behavior across device types

### Performance Testing

- Lighthouse audit (target: 85+ score)
- Bundle size analysis
- Runtime performance monitoring
- Memory usage profiling
- FPS monitoring during animations

---

## Performance Optimization Strategy

### Image Optimization

- Use WebP format with PNG fallback
- Implement responsive images with srcset
- Lazy load images below the fold
- Compress images to < 100KB per image

### Code Splitting

- Lazy load 3D components (Three.js, React Three Fiber)
- Separate registration form into chunks
- Dynamic imports for heavy libraries
- Tree-shake unused code

### Animation Optimization

- Use GPU-accelerated transforms (translate, scale, rotate)
- Avoid animating layout properties (width, height)
- Use requestAnimationFrame for smooth animations
- Implement animation frame throttling

### Video Optimization

- Provide multiple quality versions
- Use adaptive bitrate selection
- Implement lazy loading with Intersection Observer
- Pause videos when not visible
- Use efficient codecs (H.264, VP9)

### Bundle Size Targets

- Main bundle: < 200KB (gzipped)
- Three.js bundle: < 150KB (gzipped)
- Form bundle: < 50KB (gzipped)
- Total: < 400KB (gzipped)

---

## Accessibility Compliance

### WCAG 2.1 AA Standards

**Perceivable:**
- Color contrast ratio >= 4.5:1 for text
- Alt text for all images
- Captions for videos
- Readable font sizes (minimum 16px)

**Operable:**
- Keyboard navigation for all interactive elements
- Focus indicators visible
- No keyboard traps
- Touch targets >= 44x44px

**Understandable:**
- Clear, simple language
- Consistent navigation
- Error messages and suggestions
- Form labels and instructions

**Robust:**
- Valid HTML and ARIA
- Semantic markup
- Screen reader compatibility
- Assistive technology support

---

## Design System

### Typography

**Font Family:** Inter (primary), Playfair Display (headings)

**Font Sizes:**
- H1: 48px (desktop), 32px (mobile)
- H2: 36px (desktop), 24px (mobile)
- H3: 28px (desktop), 20px (mobile)
- Body: 16px (desktop), 14px (mobile)
- Small: 14px (desktop), 12px (mobile)

**Font Weights:** 300 (light), 400 (regular), 600 (semibold), 700 (bold)

### Color Palette

**Primary:** Orange (#FF6B35)
**Secondary:** Dark Blue (#1A1A2E)
**Accent:** Cyan (#00D9FF)
**Neutral:** Gray (#F5F5F5), (#333333)
**Success:** Green (#4CAF50)
**Error:** Red (#F44336)

### Spacing Scale

8px, 16px, 24px, 32px, 48px, 64px

### Border Radius

Small: 4px, Medium: 8px, Large: 16px

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions
- Graceful degradation for older browsers

