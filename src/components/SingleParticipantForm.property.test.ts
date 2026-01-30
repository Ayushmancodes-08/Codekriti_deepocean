import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { SingleParticipantSchema, SingleParticipant } from '../lib/schemas';

/**
 * Property 2: Single Participant Form Completeness
 * For any single participant event registration, all required fields
 * (name, college, student ID, phone, email, branch, year) must be present
 * and validated before submission is allowed.
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4
 */
describe('SingleParticipantForm - Property 2: Form Completeness', () => {
  // Arbitraries for generating valid form data
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

  const validFormDataArbitrary = fc.tuple(
    nameArbitrary,
    collegeArbitrary,
    studentIdArbitrary,
    phoneArbitrary,
    emailArbitrary,
    branchArbitrary,
    yearArbitrary
  );

  it('should validate all required fields are present in valid data', () => {
    fc.assert(
      fc.property(validFormDataArbitrary, ([name, college, studentId, phone, email, branch, year]) => {
        const formData: SingleParticipant = {
          name,
          college,
          studentId,
          phoneNumber: phone,
          email,
          branch,
          year,
        };

        const result = SingleParticipantSchema.safeParse(formData);
        expect(result.success).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should reject data with missing name field', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          collegeArbitrary,
          studentIdArbitrary,
          phoneArbitrary,
          emailArbitrary,
          branchArbitrary,
          yearArbitrary
        ),
        ([college, studentId, phone, email, branch, year]) => {
          const formData = {
            name: '',
            college,
            studentId,
            phoneNumber: phone,
            email,
            branch,
            year,
          };

          const result = SingleParticipantSchema.safeParse(formData);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should reject data with invalid email format', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          nameArbitrary,
          collegeArbitrary,
          studentIdArbitrary,
          phoneArbitrary,
          branchArbitrary,
          yearArbitrary
        ),
        ([name, college, studentId, phone, branch, year]) => {
          const invalidEmails = fc.sample(
            fc.string({ minLength: 1, maxLength: 10 }).filter((s) => !s.includes('@')),
            5
          );

          invalidEmails.forEach((invalidEmail) => {
            const formData = {
              name,
              college,
              studentId,
              phoneNumber: phone,
              email: invalidEmail,
              branch,
              year,
            };

            const result = SingleParticipantSchema.safeParse(formData);
            expect(result.success).toBe(false);
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should reject data with invalid phone number format', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          nameArbitrary,
          collegeArbitrary,
          studentIdArbitrary,
          emailArbitrary,
          branchArbitrary,
          yearArbitrary
        ),
        ([name, college, studentId, email, branch, year]) => {
          // Generate invalid phone numbers (not exactly 10 digits)
          const invalidPhones = [
            '123',
            '12345678901',
            'abcdefghij',
            '123-456-7890',
          ];

          invalidPhones.forEach((invalidPhone) => {
            const formData = {
              name,
              college,
              studentId,
              phoneNumber: invalidPhone,
              email,
              branch,
              year,
            };

            const result = SingleParticipantSchema.safeParse(formData);
            expect(result.success).toBe(false);
          });
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 4: Form Validation Round Trip
 * For any valid registration data, serializing to form state and
 * deserializing back should produce equivalent data.
 * Validates: Requirements 8.2, 9.2, 10.2
 */
describe('SingleParticipantForm - Property 4: Validation Round Trip', () => {
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

  const validFormDataArbitrary = fc.tuple(
    nameArbitrary,
    collegeArbitrary,
    studentIdArbitrary,
    phoneArbitrary,
    emailArbitrary,
    branchArbitrary,
    yearArbitrary
  );

  it('should preserve form data through serialization and deserialization', () => {
    fc.assert(
      fc.property(validFormDataArbitrary, ([name, college, studentId, phone, email, branch, year]) => {
        const originalData: SingleParticipant = {
          name,
          college,
          studentId,
          phoneNumber: phone,
          email,
          branch,
          year,
        };

        // Validate original data
        const originalValidation = SingleParticipantSchema.safeParse(originalData);
        expect(originalValidation.success).toBe(true);

        // Serialize to JSON
        const serialized = JSON.stringify(originalData);

        // Deserialize from JSON
        const deserialized = JSON.parse(serialized) as SingleParticipant;

        // Validate deserialized data
        const deserializedValidation = SingleParticipantSchema.safeParse(deserialized);
        expect(deserializedValidation.success).toBe(true);

        // Check equivalence
        expect(deserialized).toEqual(originalData);
      }),
      { numRuns: 100 }
    );
  });

  it('should maintain field values through round trip', () => {
    fc.assert(
      fc.property(validFormDataArbitrary, ([name, college, studentId, phone, email, branch, year]) => {
        const originalData: SingleParticipant = {
          name,
          college,
          studentId,
          phoneNumber: phone,
          email,
          branch,
          year,
        };

        const serialized = JSON.stringify(originalData);
        const deserialized = JSON.parse(serialized) as SingleParticipant;

        // Verify each field is preserved
        expect(deserialized.name).toBe(originalData.name);
        expect(deserialized.college).toBe(originalData.college);
        expect(deserialized.studentId).toBe(originalData.studentId);
        expect(deserialized.phoneNumber).toBe(originalData.phoneNumber);
        expect(deserialized.email).toBe(originalData.email);
        expect(deserialized.branch).toBe(originalData.branch);
        expect(deserialized.year).toBe(originalData.year);
      }),
      { numRuns: 100 }
    );
  });
});
