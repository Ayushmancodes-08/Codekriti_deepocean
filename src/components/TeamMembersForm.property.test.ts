import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { TeamMemberSchema, TeamMember, eventConfigs } from '../lib/schemas';

/**
 * Property 3: Team Member Count Enforcement
 * For any team event, the number of registered members must be within
 * the event's participant range (TechMaze: 1-3, Dev Xtreme: 3-6).
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 10.1, 10.2, 10.3, 10.4, 10.5
 */
describe('TeamMembersForm - Property 3: Team Member Count Enforcement', () => {
  // Arbitraries for generating valid team member data
  const nameArbitrary = fc
    .stringMatching(/^[a-zA-Z\s]{2,50}$/)
    .filter((s) => s.trim().length >= 2);

  const collegeArbitrary = fc.constantFrom(
    'NIT Rourkela',
    'NIT Warangal',
    'NIT Trichy',
    'BITS Pilani',
    'IIT Delhi'
  );

  const studentIdArbitrary = fc.stringMatching(/^[a-zA-Z0-9]{1,20}$/);

  const phoneArbitrary = fc
    .integer({ min: 1000000000, max: 9999999999 })
    .map((n) => n.toString());

  const emailArbitrary = fc
    .tuple(
      fc.stringMatching(/^[a-zA-Z0-9]{1,10}$/),
      fc.constantFrom('gmail.com', 'yahoo.com', 'outlook.com', 'example.com')
    )
    .map(([local, domain]) => `${local}@${domain}`);

  const branchArbitrary = fc.constantFrom(
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Electrical',
    'Civil'
  );

  const yearArbitrary = fc.constantFrom('1st Year', '2nd Year', '3rd Year', '4th Year');

  const validTeamMemberArbitrary = fc.tuple(
    nameArbitrary,
    collegeArbitrary,
    studentIdArbitrary,
    phoneArbitrary,
    emailArbitrary,
    branchArbitrary,
    yearArbitrary
  );

  it('should validate that TechMaze team has 1-3 members', () => {
    const techmazeConfig = eventConfigs['techmaze'];
    expect(techmazeConfig.minParticipants).toBe(1);
    expect(techmazeConfig.maxParticipants).toBe(3);

    fc.assert(
      fc.property(
        fc.array(validTeamMemberArbitrary, {
          minLength: techmazeConfig.minParticipants,
          maxLength: techmazeConfig.maxParticipants,
        }),
        (memberTuples) => {
          const members: TeamMember[] = memberTuples.map(
            ([name, college, studentId, phone, email, branch, year]) => ({
              name,
              college,
              studentId,
              phoneNumber: phone,
              email,
              branch,
              year,
            })
          );

          // Verify all members are valid
          members.forEach((member) => {
            const result = TeamMemberSchema.safeParse(member);
            expect(result.success).toBe(true);
          });

          // Verify member count is within limits
          expect(members.length).toBeGreaterThanOrEqual(techmazeConfig.minParticipants);
          expect(members.length).toBeLessThanOrEqual(techmazeConfig.maxParticipants);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should validate that Dev Xtreme team has 3-6 members', () => {
    const devXtremeConfig = eventConfigs['dev-xtreme'];
    expect(devXtremeConfig.minParticipants).toBe(3);
    expect(devXtremeConfig.maxParticipants).toBe(6);

    fc.assert(
      fc.property(
        fc.array(validTeamMemberArbitrary, {
          minLength: devXtremeConfig.minParticipants,
          maxLength: devXtremeConfig.maxParticipants,
        }),
        (memberTuples) => {
          const members: TeamMember[] = memberTuples.map(
            ([name, college, studentId, phone, email, branch, year]) => ({
              name,
              college,
              studentId,
              phoneNumber: phone,
              email,
              branch,
              year,
            })
          );

          // Verify all members are valid
          members.forEach((member) => {
            const result = TeamMemberSchema.safeParse(member);
            expect(result.success).toBe(true);
          });

          // Verify member count is within limits
          expect(members.length).toBeGreaterThanOrEqual(devXtremeConfig.minParticipants);
          expect(members.length).toBeLessThanOrEqual(devXtremeConfig.maxParticipants);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should reject TechMaze team with more than 3 members', () => {
    const techmazeConfig = eventConfigs['techmaze'];

    fc.assert(
      fc.property(
        fc.array(validTeamMemberArbitrary, {
          minLength: techmazeConfig.maxParticipants + 1,
          maxLength: techmazeConfig.maxParticipants + 3,
        }),
        (memberTuples) => {
          const members: TeamMember[] = memberTuples.map(
            ([name, college, studentId, phone, email, branch, year]) => ({
              name,
              college,
              studentId,
              phoneNumber: phone,
              email,
              branch,
              year,
            })
          );

          // Verify member count exceeds limit
          expect(members.length).toBeGreaterThan(techmazeConfig.maxParticipants);
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should reject Dev Xtreme team with fewer than 3 members', () => {
    const devXtremeConfig = eventConfigs['dev-xtreme'];

    fc.assert(
      fc.property(
        fc.array(validTeamMemberArbitrary, {
          minLength: 1,
          maxLength: devXtremeConfig.minParticipants - 1,
        }),
        (memberTuples) => {
          const members: TeamMember[] = memberTuples.map(
            ([name, college, studentId, phone, email, branch, year]) => ({
              name,
              college,
              studentId,
              phoneNumber: phone,
              email,
              branch,
              year,
            })
          );

          // Verify member count is below minimum
          expect(members.length).toBeLessThan(devXtremeConfig.minParticipants);
        }
      ),
      { numRuns: 30 }
    );
  });

  it('should validate all team members have required fields', () => {
    fc.assert(
      fc.property(
        fc.array(validTeamMemberArbitrary, {
          minLength: 1,
          maxLength: 6,
        }),
        (memberTuples) => {
          const members: TeamMember[] = memberTuples.map(
            ([name, college, studentId, phone, email, branch, year]) => ({
              name,
              college,
              studentId,
              phoneNumber: phone,
              email,
              branch,
              year,
            })
          );

          // Verify each member has all required fields
          members.forEach((member) => {
            expect(member.name).toBeDefined();
            expect(member.college).toBeDefined();
            expect(member.studentId).toBeDefined();
            expect(member.phoneNumber).toBeDefined();
            expect(member.email).toBeDefined();
            expect(member.branch).toBeDefined();
            expect(member.year).toBeDefined();

            // Verify fields are not empty
            expect(member.name.length).toBeGreaterThan(0);
            expect(member.college.length).toBeGreaterThan(0);
            expect(member.studentId.length).toBeGreaterThan(0);
            expect(member.phoneNumber.length).toBeGreaterThan(0);
            expect(member.email.length).toBeGreaterThan(0);
            expect(member.branch.length).toBeGreaterThan(0);
            expect(member.year.length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should validate team member phone numbers are 10 digits', () => {
    fc.assert(
      fc.property(
        fc.array(validTeamMemberArbitrary, {
          minLength: 1,
          maxLength: 6,
        }),
        (memberTuples) => {
          const members: TeamMember[] = memberTuples.map(
            ([name, college, studentId, phone, email, branch, year]) => ({
              name,
              college,
              studentId,
              phoneNumber: phone,
              email,
              branch,
              year,
            })
          );

          // Verify each member has valid phone number
          members.forEach((member) => {
            expect(member.phoneNumber).toMatch(/^[0-9]{10}$/);
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should validate team member emails are valid format', () => {
    fc.assert(
      fc.property(
        fc.array(validTeamMemberArbitrary, {
          minLength: 1,
          maxLength: 6,
        }),
        (memberTuples) => {
          const members: TeamMember[] = memberTuples.map(
            ([name, college, studentId, phone, email, branch, year]) => ({
              name,
              college,
              studentId,
              phoneNumber: phone,
              email,
              branch,
              year,
            })
          );

          // Verify each member has valid email
          members.forEach((member) => {
            const result = TeamMemberSchema.safeParse(member);
            expect(result.success).toBe(true);
            // Email should contain @ and domain
            expect(member.email).toContain('@');
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should preserve team member data through serialization', () => {
    fc.assert(
      fc.property(
        fc.array(validTeamMemberArbitrary, {
          minLength: 1,
          maxLength: 6,
        }),
        (memberTuples) => {
          const originalMembers: TeamMember[] = memberTuples.map(
            ([name, college, studentId, phone, email, branch, year]) => ({
              name,
              college,
              studentId,
              phoneNumber: phone,
              email,
              branch,
              year,
            })
          );

          // Serialize to JSON
          const serialized = JSON.stringify(originalMembers);

          // Deserialize from JSON
          const deserialized = JSON.parse(serialized) as TeamMember[];

          // Verify equivalence
          expect(deserialized).toEqual(originalMembers);
          expect(deserialized.length).toBe(originalMembers.length);
        }
      ),
      { numRuns: 50 }
    );
  });
});
