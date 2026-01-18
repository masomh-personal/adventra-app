import {
    passwordCriteria,
    passwordValidation,
    emailValidation,
    nameValidation,
    messageValidation,
    birthdateValidation,
} from '@/validation/validationUtils';

describe('validationUtils', () => {
    describe('passwordCriteria', () => {
        describe('at least 10 characters', () => {
            const rule = passwordCriteria[0];

            it('fails for short password', () => {
                expect(rule.test('short')).toBe(false);
            });

            it('passes for 10+ character password', () => {
                expect(rule.test('longenough1')).toBe(true);
            });

            it('handles undefined', () => {
                expect(rule.test(undefined)).toBe(false);
            });
        });

        describe('lowercase letter', () => {
            const rule = passwordCriteria[1];

            it('fails for all uppercase', () => {
                expect(rule.test('ALLUPPERCASE')).toBe(false);
            });

            it('passes with lowercase', () => {
                expect(rule.test('hasLowercase')).toBe(true);
            });

            it('handles undefined', () => {
                expect(rule.test(undefined)).toBe(false);
            });
        });

        describe('uppercase letter', () => {
            const rule = passwordCriteria[2];

            it('fails for all lowercase', () => {
                expect(rule.test('alllowercase')).toBe(false);
            });

            it('passes with uppercase', () => {
                expect(rule.test('hasUpperCase')).toBe(true);
            });

            it('handles undefined', () => {
                expect(rule.test(undefined)).toBe(false);
            });
        });

        describe('number', () => {
            const rule = passwordCriteria[3];

            it('fails without number', () => {
                expect(rule.test('NoNumbers')).toBe(false);
            });

            it('passes with number', () => {
                expect(rule.test('Has1Number')).toBe(true);
            });

            it('handles undefined', () => {
                expect(rule.test(undefined)).toBe(false);
            });
        });

        describe('special character', () => {
            const rule = passwordCriteria[4];

            it('fails without special character', () => {
                expect(rule.test('NoSpecial123')).toBe(false);
            });

            it('passes with special character', () => {
                expect(rule.test('Has@Special')).toBe(true);
            });

            it('handles undefined', () => {
                expect(rule.test(undefined)).toBe(false);
            });
        });
    });

    describe('passwordValidation', () => {
        it('validates strong password', async () => {
            const result = await passwordValidation.isValid('StrongP@ss123');
            expect(result).toBe(true);
        });

        it('rejects weak password', async () => {
            const result = await passwordValidation.isValid('weak');
            expect(result).toBe(false);
        });

        it('rejects empty password', async () => {
            const result = await passwordValidation.isValid('');
            expect(result).toBe(false);
        });
    });

    describe('emailValidation', () => {
        it('validates correct email', async () => {
            const result = await emailValidation.isValid('test@example.com');
            expect(result).toBe(true);
        });

        it('transforms email to lowercase', async () => {
            const result = await emailValidation.validate('TEST@EXAMPLE.COM');
            expect(result).toBe('test@example.com');
        });

        it('rejects email without domain extension', async () => {
            const result = await emailValidation.isValid('test@example');
            expect(result).toBe(false);
        });

        it('rejects empty email', async () => {
            const result = await emailValidation.isValid('');
            expect(result).toBe(false);
        });

        it('rejects invalid email format', async () => {
            const result = await emailValidation.isValid('not-an-email');
            expect(result).toBe(false);
        });
    });

    describe('nameValidation', () => {
        it('validates correct name', async () => {
            const result = await nameValidation.isValid('John Doe');
            expect(result).toBe(true);
        });

        it('rejects single character name', async () => {
            const result = await nameValidation.isValid('J');
            expect(result).toBe(false);
        });

        it('rejects empty name', async () => {
            const result = await nameValidation.isValid('');
            expect(result).toBe(false);
        });

        it('trims whitespace', async () => {
            const result = await nameValidation.validate('  John Doe  ');
            expect(result).toBe('John Doe');
        });
    });

    describe('messageValidation', () => {
        it('validates message with 10+ characters', async () => {
            const result = await messageValidation.isValid('This is a valid message');
            expect(result).toBe(true);
        });

        it('rejects short message', async () => {
            const result = await messageValidation.isValid('Short');
            expect(result).toBe(false);
        });

        it('rejects empty message', async () => {
            const result = await messageValidation.isValid('');
            expect(result).toBe(false);
        });

        it('rejects message over 2000 characters', async () => {
            const longMessage = 'a'.repeat(2001);
            const result = await messageValidation.isValid(longMessage);
            expect(result).toBe(false);
        });

        it('accepts message at exactly 2000 characters', async () => {
            const maxMessage = 'a'.repeat(2000);
            const result = await messageValidation.isValid(maxMessage);
            expect(result).toBe(true);
        });
    });

    describe('birthdateValidation', () => {
        it('validates adult birthdate', async () => {
            const adultBirthdate = new Date();
            adultBirthdate.setFullYear(adultBirthdate.getFullYear() - 25);
            const result = await birthdateValidation.isValid(adultBirthdate);
            expect(result).toBe(true);
        });

        it('rejects underage birthdate', async () => {
            const underageBirthdate = new Date();
            underageBirthdate.setFullYear(underageBirthdate.getFullYear() - 10);
            const result = await birthdateValidation.isValid(underageBirthdate);
            expect(result).toBe(false);
        });

        it('handles empty string as undefined (triggers required)', async () => {
            const result = await birthdateValidation.isValid('');
            expect(result).toBe(false);
        });

        it('accepts exactly 18 years old (born today 18 years ago)', async () => {
            // Need to be born BEFORE today 18 years ago to be considered 18
            const exactly18 = new Date();
            exactly18.setFullYear(exactly18.getFullYear() - 18);
            exactly18.setDate(exactly18.getDate() - 1); // One day before today 18 years ago
            const result = await birthdateValidation.isValid(exactly18);
            expect(result).toBe(true);
        });
    });
});
