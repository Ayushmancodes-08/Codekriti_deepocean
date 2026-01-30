import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  SingleParticipantSchema,
  TeamMemberSchema,
  TeamDetailsSchema,
  TeamLeaderSchema,
  SingleParticipantRegistrationSchema,
  TeamRegistrationSchema,
  EventTypeSchema,
  eventConfigs,
} from './schemas';

/**
 * Property 4: Form Validation Round Trip
 * For any valid registration data, serializing to form state and deserializing back
 * should produce equivalent data.
 * Validates: Requirements 8.2, 9.2, 10.2
 */
describe('Property 4: Form Validation Round Trip', () => {
  // Arbitraries for generating test data
  const nameArbitrary = fc.stringMatching(/^[a-zA-Z\s]{2,50}$/);
  const collegeArbitrary = fc.stringMatching(/^[a-zA-Z\s]{2,50}$/);
  const studentIdArbitrary = fc.stringMatching(/^[A-Z0-9]{3,20}$/);
  const phoneArbitrary = fc.stringMatching(/^[0-9]{10}$/);
  const emailArbitrary = fc.emailAddress();
  const branchArbitrary = fc.stringMatching(/^[a-zA-Z\s]{2,50}$/);
  const yearArbitrary = fc.stringMatching(/^(2022|2023|2024|2025)$/);
  const teamNameArbitrary = fc.stringMatching(/^[a-zA-Z0-9\s]{2,50}$/);

  const singleParticipantArbitrary = fc.record({
    name: nameArbitrary,
    college: collegeArbitrary,
    studentId: studentIdArbitrary,
    phoneNumber: phoneArbitrary,
    email: emailArbitrary,
    branch: branchArbitrary,
    year: yearArbitrary,
  });

  const teamMemberArbitrary = fc.record({
    name: nameArbitrary,
    college: collegeArbitrary,
    studentId: studentIdArbitrary,
    phoneNumber: phoneArbitrary,
    email: emailArbitrary,
    branch: branchArbitrary,
    year: yearArbitrary,
  });

  const teamLeaderArbitrary = fc.record({
    name: nameArbitrary,
    phoneNumber: phoneArbitrary,
    email: emailArbitrary,
  });

  const teamDetailsArbitrary = fc.record({
    name: teamNameArbitrary,
    college: collegeArbitrary,
    leader: teamLeaderArbitrary,
  });

  it('should validate single participant data round trip', () => {
    fc.assert(
      fc.property(singleParticipantArbitrary, (participant) => {
        // Parse the data
        const parseResult = SingleParticipantSchema.safeParse(participant);
        
        if (!parseResult.success) {
          // If parsing fails, the data is invalid
          return true;
        }

        const parsed = parseResult.data;

        // Serialize back to object
        const serialized = {
          name: parsed.name,
          college: parsed.college,
          studentId: parsed.studentId,
          phoneNumber: parsed.phoneNumber,
          email: parsed.email,
          branch: parsed.branch,
          year: parsed.year,
        };

        // Parse again
        const reparseResult = SingleParticipantSchema.safeParse(serialized);
        
        // Should succeed
        expect(reparseResult.success).toBe(true);
        
        if (reparseResult.success) {
          // Data should be equivalent
          expect(reparseResult.data).toEqual(parsed);
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should validate team member data round trip', () => {
    fc.assert(
      fc.property(teamMemberArbitrary, (member) => {
        // Parse the data
        const parseResult = TeamMemberSchema.safeParse(member);
        
        if (!parseResult.success) {
          return true;
        }

        const parsed = parseResult.data;

        // Serialize back to object
        const serialized = {
          name: parsed.name,
          college: parsed.college,
          studentId: parsed.studentId,
          phoneNumber: parsed.phoneNumber,
          email: parsed.email,
          branch: parsed.branch,
          year: parsed.year,
        };

        // Parse again
        const reparseResult = TeamMemberSchema.safeParse(serialized);
        
        // Should succeed
        expect(reparseResult.success).toBe(true);
        
        if (reparseResult.success) {
          // Data should be equivalent
          expect(reparseResult.data).toEqual(parsed);
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should validate team leader data round trip', () => {
    fc.assert(
      fc.property(teamLeaderArbitrary, (leader) => {
        // Parse the data
        const parseResult = TeamLeaderSchema.safeParse(leader);
        
        if (!parseResult.success) {
          return true;
        }

        const parsed = parseResult.data;

        // Serialize back to object
        const serialized = {
          name: parsed.name,
          phoneNumber: parsed.phoneNumber,
          email: parsed.email,
        };

        // Parse again
        const reparseResult = TeamLeaderSchema.safeParse(serialized);
        
        // Should succeed
        expect(reparseResult.success).toBe(true);
        
        if (reparseResult.success) {
          // Data should be equivalent
          expect(reparseResult.data).toEqual(parsed);
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should validate team details data round trip', () => {
    fc.assert(
      fc.property(teamDetailsArbitrary, (teamDetails) => {
        // Parse the data
        const parseResult = TeamDetailsSchema.safeParse(teamDetails);
        
        if (!parseResult.success) {
          return true;
        }

        const parsed = parseResult.data;

        // Serialize back to object
        const serialized = {
          name: parsed.name,
          college: parsed.college,
          leader: {
            name: parsed.leader.name,
            phoneNumber: parsed.leader.phoneNumber,
            email: parsed.leader.email,
          },
        };

        // Parse again
        const reparseResult = TeamDetailsSchema.safeParse(serialized);
        
        // Should succeed
        expect(reparseResult.success).toBe(true);
        
        if (reparseResult.success) {
          // Data should be equivalent
          expect(reparseResult.data).toEqual(parsed);
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should validate single participant registration round trip', () => {
    fc.assert(
      fc.property(
        fc.record({
          eventType: fc.constantFrom('algo-to-code', 'designathon'),
          participant: singleParticipantArbitrary,
        }),
        (registration) => {
          // Parse the data
          const parseResult = SingleParticipantRegistrationSchema.safeParse(registration);
          
          if (!parseResult.success) {
            return true;
          }

          const parsed = parseResult.data;

          // Serialize back to object
          const serialized = {
            eventType: parsed.eventType,
            participant: {
              name: parsed.participant.name,
              college: parsed.participant.college,
              studentId: parsed.participant.studentId,
              phoneNumber: parsed.participant.phoneNumber,
              email: parsed.participant.email,
              branch: parsed.participant.branch,
              year: parsed.participant.year,
            },
          };

          // Parse again
          const reparseResult = SingleParticipantRegistrationSchema.safeParse(serialized);
          
          // Should succeed
          expect(reparseResult.success).toBe(true);
          
          if (reparseResult.success) {
            // Data should be equivalent
            expect(reparseResult.data).toEqual(parsed);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate team registration round trip', () => {
    fc.assert(
      fc.property(
        fc.record({
          eventType: fc.constantFrom('techmaze', 'dev-xtreme'),
          team: teamDetailsArbitrary,
          members: fc.array(teamMemberArbitrary, { minLength: 1, maxLength: 6 }),
        }),
        (registration) => {
          // Parse the data
          const parseResult = TeamRegistrationSchema.safeParse(registration);
          
          if (!parseResult.success) {
            return true;
          }

          const parsed = parseResult.data;

          // Serialize back to object
          const serialized = {
            eventType: parsed.eventType,
            team: {
              name: parsed.team.name,
              college: parsed.team.college,
              leader: {
                name: parsed.team.leader.name,
                phoneNumber: parsed.team.leader.phoneNumber,
                email: parsed.team.leader.email,
              },
            },
            members: parsed.members.map((m) => ({
              name: m.name,
              college: m.college,
              studentId: m.studentId,
              phoneNumber: m.phoneNumber,
              email: m.email,
              branch: m.branch,
              year: m.year,
            })),
          };

          // Parse again
          const reparseResult = TeamRegistrationSchema.safeParse(serialized);
          
          // Should succeed
          expect(reparseResult.success).toBe(true);
          
          if (reparseResult.success) {
            // Data should be equivalent
            expect(reparseResult.data).toEqual(parsed);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
