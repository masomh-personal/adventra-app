import {
    passwordCriteria,
    passwordValidation,
    emailValidation,
    nameValidation,
    messageValidation,
    birthdateValidation,
} from './validationUtils';

describe('validationUtils', () => {
    describe('passwordCriteria', () => {
        test('has all required criteria', () => {
            expect(passwordCriteria).toHaveLength(5);
            expect(passwordCriteria[0].label).toBe('At least 10 characters');
            expect(passwordCriteria[1].label).toBe('Lowercase letter');
            expect(passwordCriteria[2].label).toBe('Uppercase letter');
            expect(passwordCriteria[3].label).toBe('Number');
            expect(passwordCriteria[4].label).toBe('Special character');
        });

        test('validates minimum length', () => {
            const criteria = passwordCriteria[0];
            expect(criteria.test('short')).toBe(false);
            expect(criteria.test('longenoughpass')).toBe(true);
        });

        test('validates lowercase letter', () => {
            const criteria = passwordCriteria[1];
            expect(criteria.test('PASSWORD123!')).toBe(false);
            expect(criteria.test('PASSWORD123!a')).toBe(true);
        });

        test('validates uppercase letter', () => {
            const criteria = passwordCriteria[2];
            expect(criteria.test('password123!')).toBe(false);
            expect(criteria.test('password123!A')).toBe(true);
        });

        test('validates number', () => {
            const criteria = passwordCriteria[3];
            expect(criteria.test('Password!')).toBe(false);
            expect(criteria.test('Password!1')).toBe(true);
        });

        test('validates special character', () => {
            const criteria = passwordCriteria[4];
            expect(criteria.test('Password1')).toBe(false);
            expect(criteria.test('Password1!')).toBe(true);
        });
    });

    describe('passwordValidation', () => {
        test('rejects empty password', async () => {
            await expect(passwordValidation.validate('')).rejects.toThrow();
        });

        test('rejects password shorter than 10 characters', async () => {
            await expect(passwordValidation.validate('Short1!')).rejects.toThrow();
        });

        test('validates correct password', async () => {
            const result = await passwordValidation.validate('ValidPass123!');
            expect(result).toBe('ValidPass123!');
        });
    });

    describe('emailValidation', () => {
        test('rejects empty email', async () => {
            await expect(emailValidation.validate('')).rejects.toThrow('Email is required');
        });

        test('rejects invalid email format', async () => {
            await expect(emailValidation.validate('notanemail')).rejects.toThrow();
        });

        test('accepts valid email', async () => {
            const result = await emailValidation.validate('test@example.com');
            expect(result).toBe('test@example.com');
        });

        test('transforms email to lowercase', async () => {
            const result = await emailValidation.validate('TEST@EXAMPLE.COM');
            expect(result).toBe('test@example.com');
        });
    });

    describe('nameValidation', () => {
        test('rejects empty name', async () => {
            await expect(nameValidation.validate('')).rejects.toThrow('Name is required');
        });

        test('rejects name shorter than 2 characters', async () => {
            await expect(nameValidation.validate('A')).rejects.toThrow();
        });

        test('trims whitespace', async () => {
            const result = await nameValidation.validate('  John Doe  ');
            expect(result).toBe('John Doe');
        });

        test('accepts valid name', async () => {
            const result = await nameValidation.validate('John Doe');
            expect(result).toBe('John Doe');
        });
    });

    describe('messageValidation', () => {
        test('rejects empty message', async () => {
            await expect(messageValidation.validate('')).rejects.toThrow();
        });

        test('rejects message shorter than 10 characters', async () => {
            await expect(messageValidation.validate('Short')).rejects.toThrow();
        });

        test('rejects message longer than 2000 characters', async () => {
            const longMessage = 'a'.repeat(2001);
            await expect(messageValidation.validate(longMessage)).rejects.toThrow();
        });

        test('accepts valid message', async () => {
            const result = await messageValidation.validate(
                'This is a valid message with enough characters.',
            );
            expect(result).toBe('This is a valid message with enough characters.');
        });
    });

    describe('birthdateValidation', () => {
        test('rejects empty birthdate', async () => {
            await expect(birthdateValidation.validate('')).rejects.toThrow(
                'Date of birth is required',
            );
        });

        test('rejects birthdate for someone under 18', async () => {
            const today = new Date();
            const under18Date = new Date(
                today.getFullYear() - 17,
                today.getMonth(),
                today.getDate(),
            );
            await expect(birthdateValidation.validate(under18Date)).rejects.toThrow(
                'at least 18 years old',
            );
        });

        test('rejects birthdate exactly on boundary (not 18 yet)', async () => {
            const today = new Date();
            const exactly18ButSameMonth = new Date(
                today.getFullYear() - 18,
                today.getMonth(),
                today.getDate() + 1,
            );
            await expect(birthdateValidation.validate(exactly18ButSameMonth)).rejects.toThrow(
                'at least 18 years old',
            );
        });

        test('accepts valid birthdate for 18+', async () => {
            const today = new Date();
            const validDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
            const result = await birthdateValidation.validate(validDate);
            expect(result).toBeInstanceOf(Date);
        });

        test('accepts birthdate exactly 18 years ago (same day)', async () => {
            const today = new Date();
            const exactly18 = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            const result = await birthdateValidation.validate(exactly18);
            expect(result).toBeInstanceOf(Date);
        });
    });
});
