import { describe, it, expect } from 'vitest';
import {
  SingleParticipantSchema,
  TeamMemberSchema,
  TeamLeaderSchema,
  TeamDetailsSchema,
  SingleParticipantRegistrationSchema,
  TeamRegistrationSchema,
  EventTypeSchema,
  eventConfigs,
} from './schemas';

describe('Zod Schemas - Single Participant', () => {
  it('should validate a valid single participant', () => {
    const validParticipant = {
      name: 'John Doe',
      college: 'MIT',
      studentId: 'MIT123',
      phoneNumber: '9876543210',
      email: 'john@example.com',
      branch: 'Computer Science',
      year: '2024',
    };

    const result = SingleParticipantSchema.safeParse(validParticipant);
    expect(result.success).toBe(true);
  });

  it('should reject participant with invalid email', () => {
    const invalidParticipant = {
      name: 'John Doe',
      college: 'MIT',
      studentId: 'MIT123',
      phoneNumber: '9876543210',
      email: 'invalid-email',
      branch: 'Computer Science',
      year: '2024',
    };

    const result = SingleParticipantSchema.safeParse(invalidParticipant);
    expect(result.success).toBe(false);
  });

  it('should reject participant with invalid phone number', () => {
    const invalidParticipant = {
      name: 'John Doe',
      college: 'MIT',
      studentId: 'MIT123',
      phoneNumber: '123',
      email: 'john@example.com',
      branch: 'Computer Science',
      year: '2024',
    };

    const result = SingleParticipantSchema.safeParse(invalidParticipant);
    expect(result.success).toBe(false);
  });

  it('should reject participant with short name', () => {
    const invalidParticipant = {
      name: 'J',
      college: 'MIT',
      studentId: 'MIT123',
      phoneNumber: '9876543210',
      email: 'john@example.com',
      branch: 'Computer Science',
      year: '2024',
    };

    const result = SingleParticipantSchema.safeParse(invalidParticipant);
    expect(result.success).toBe(false);
  });

  it('should reject participant with missing required fields', () => {
    const incompleteParticipant = {
      name: 'John Doe',
      college: 'MIT',
    };

    const result = SingleParticipantSchema.safeParse(incompleteParticipant);
    expect(result.success).toBe(false);
  });
});

describe('Zod Schemas - Team Member', () => {
  it('should validate a valid team member', () => {
    const validMember = {
      name: 'Jane Doe',
      college: 'Stanford',
      studentId: 'STAN456',
      phoneNumber: '8765432109',
      email: 'jane@example.com',
      branch: 'Electrical Engineering',
      year: '2023',
    };

    const result = TeamMemberSchema.safeParse(validMember);
    expect(result.success).toBe(true);
  });

  it('should reject team member with invalid phone', () => {
    const invalidMember = {
      name: 'Jane Doe',
      college: 'Stanford',
      studentId: 'STAN456',
      phoneNumber: '876543210',
      email: 'jane@example.com',
      branch: 'Electrical Engineering',
      year: '2023',
    };

    const result = TeamMemberSchema.safeParse(invalidMember);
    expect(result.success).toBe(false);
  });
});

describe('Zod Schemas - Team Leader', () => {
  it('should validate a valid team leader', () => {
    const validLeader = {
      name: 'Alice Smith',
      phoneNumber: '7654321098',
      email: 'alice@example.com',
    };

    const result = TeamLeaderSchema.safeParse(validLeader);
    expect(result.success).toBe(true);
  });

  it('should reject team leader with invalid email', () => {
    const invalidLeader = {
      name: 'Alice Smith',
      phoneNumber: '7654321098',
      email: 'not-an-email',
    };

    const result = TeamLeaderSchema.safeParse(invalidLeader);
    expect(result.success).toBe(false);
  });
});

describe('Zod Schemas - Team Details', () => {
  it('should validate valid team details', () => {
    const validTeamDetails = {
      name: 'Team Alpha',
      college: 'Harvard',
      leader: {
        name: 'Bob Johnson',
        phoneNumber: '6543210987',
        email: 'bob@example.com',
      },
    };

    const result = TeamDetailsSchema.safeParse(validTeamDetails);
    expect(result.success).toBe(true);
  });

  it('should reject team details with short team name', () => {
    const invalidTeamDetails = {
      name: 'T',
      college: 'Harvard',
      leader: {
        name: 'Bob Johnson',
        phoneNumber: '6543210987',
        email: 'bob@example.com',
      },
    };

    const result = TeamDetailsSchema.safeParse(invalidTeamDetails);
    expect(result.success).toBe(false);
  });
});

describe('Zod Schemas - Single Participant Registration', () => {
  it('should validate a valid single participant registration', () => {
    const validRegistration = {
      eventType: 'algo-to-code',
      participant: {
        name: 'John Doe',
        college: 'MIT',
        studentId: 'MIT123',
        phoneNumber: '9876543210',
        email: 'john@example.com',
        branch: 'Computer Science',
        year: '2024',
      },
    };

    const result = SingleParticipantRegistrationSchema.safeParse(validRegistration);
    expect(result.success).toBe(true);
  });

  it('should reject registration with invalid event type', () => {
    const invalidRegistration = {
      eventType: 'invalid-event',
      participant: {
        name: 'John Doe',
        college: 'MIT',
        studentId: 'MIT123',
        phoneNumber: '9876543210',
        email: 'john@example.com',
        branch: 'Computer Science',
        year: '2024',
      },
    };

    const result = SingleParticipantRegistrationSchema.safeParse(invalidRegistration);
    expect(result.success).toBe(false);
  });
});

describe('Zod Schemas - Team Registration', () => {
  it('should validate a valid team registration', () => {
    const validRegistration = {
      eventType: 'techmaze',
      team: {
        name: 'Team Alpha',
        college: 'Stanford',
        leader: {
          name: 'Alice Smith',
          phoneNumber: '7654321098',
          email: 'alice@example.com',
        },
      },
      members: [
        {
          name: 'Bob Johnson',
          college: 'Stanford',
          studentId: 'STAN001',
          phoneNumber: '6543210987',
          email: 'bob@example.com',
          branch: 'Computer Science',
          year: '2023',
        },
      ],
    };

    const result = TeamRegistrationSchema.safeParse(validRegistration);
    expect(result.success).toBe(true);
  });

  it('should validate team registration with multiple members', () => {
    const validRegistration = {
      eventType: 'dev-xtreme',
      team: {
        name: 'Team Beta',
        college: 'Harvard',
        leader: {
          name: 'Charlie Brown',
          phoneNumber: '5432109876',
          email: 'charlie@example.com',
        },
      },
      members: [
        {
          name: 'Diana Prince',
          college: 'Harvard',
          studentId: 'HARV001',
          phoneNumber: '4321098765',
          email: 'diana@example.com',
          branch: 'Electrical Engineering',
          year: '2022',
        },
        {
          name: 'Eve Wilson',
          college: 'Harvard',
          studentId: 'HARV002',
          phoneNumber: '3210987654',
          email: 'eve@example.com',
          branch: 'Mechanical Engineering',
          year: '2023',
        },
      ],
    };

    const result = TeamRegistrationSchema.safeParse(validRegistration);
    expect(result.success).toBe(true);
  });

  it('should reject team registration with invalid member', () => {
    const invalidRegistration = {
      eventType: 'techmaze',
      team: {
        name: 'Team Alpha',
        college: 'Stanford',
        leader: {
          name: 'Alice Smith',
          phoneNumber: '7654321098',
          email: 'alice@example.com',
        },
      },
      members: [
        {
          name: 'Bob Johnson',
          college: 'Stanford',
          studentId: 'STAN001',
          phoneNumber: 'invalid',
          email: 'bob@example.com',
          branch: 'Computer Science',
          year: '2023',
        },
      ],
    };

    const result = TeamRegistrationSchema.safeParse(invalidRegistration);
    expect(result.success).toBe(false);
  });
});

describe('Event Configuration', () => {
  it('should have all required events configured', () => {
    expect(eventConfigs['algo-to-code']).toBeDefined();
    expect(eventConfigs['designathon']).toBeDefined();
    expect(eventConfigs['techmaze']).toBeDefined();
    expect(eventConfigs['dev-xtreme']).toBeDefined();
  });

  it('should have correct event types', () => {
    expect(eventConfigs['algo-to-code'].type).toBe('single');
    expect(eventConfigs['designathon'].type).toBe('single');
    expect(eventConfigs['techmaze'].type).toBe('team');
    expect(eventConfigs['dev-xtreme'].type).toBe('team');
  });

  it('should have correct team size limits', () => {
    expect(eventConfigs['techmaze'].minParticipants).toBe(1);
    expect(eventConfigs['techmaze'].maxParticipants).toBe(3);
    expect(eventConfigs['dev-xtreme'].minParticipants).toBe(3);
    expect(eventConfigs['dev-xtreme'].maxParticipants).toBe(6);
  });
});

describe('Event Type Schema', () => {
  it('should validate valid event types', () => {
    expect(EventTypeSchema.safeParse('algo-to-code').success).toBe(true);
    expect(EventTypeSchema.safeParse('designathon').success).toBe(true);
    expect(EventTypeSchema.safeParse('techmaze').success).toBe(true);
    expect(EventTypeSchema.safeParse('dev-xtreme').success).toBe(true);
  });

  it('should reject invalid event types', () => {
    expect(EventTypeSchema.safeParse('invalid-event').success).toBe(false);
    expect(EventTypeSchema.safeParse('').success).toBe(false);
  });
});
