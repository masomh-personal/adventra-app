import { calcAgeFromBirthdate } from './calcAgeFromBirthdate';

describe('calcAgeFromBirthdate', () => {
    describe('Edge Cases', () => {
        test('returns null for null input', () => {
            expect(calcAgeFromBirthdate(null)).toBeNull();
        });

        test('returns null for undefined input', () => {
            expect(calcAgeFromBirthdate(undefined)).toBeNull();
        });

        test('returns null for empty string', () => {
            expect(calcAgeFromBirthdate('')).toBeNull();
        });

        test('returns null for invalid date string', () => {
            expect(calcAgeFromBirthdate('invalid-date')).toBeNull();
        });
    });

    describe('Date Calculations', () => {
        test('calculates age correctly for birthday in past', () => {
            const today = new Date();
            const birthYear = today.getFullYear() - 25;
            const birthdate = `${birthYear}-01-15`;
            const age = calcAgeFromBirthdate(birthdate);

            expect(age).toBe(25);
        });

        test('calculates age correctly when birthday has not occurred this year', () => {
            const today = new Date();
            const birthYear = today.getFullYear() - 25;
            // Set birthday in the future (next month)
            const futureMonth = today.getMonth() + 1;
            const birthdate = new Date(birthYear, futureMonth, 15);

            const age = calcAgeFromBirthdate(birthdate);
            expect(age).toBe(24); // Hasn't had birthday yet this year
        });

        test('calculates age correctly when birthday has occurred this year', () => {
            const today = new Date();
            const birthYear = today.getFullYear() - 30;
            // Set birthday in the past (last month)
            const pastMonth = today.getMonth() - 1;
            const birthdate = new Date(birthYear, pastMonth, 15);

            const age = calcAgeFromBirthdate(birthdate);
            expect(age).toBe(30);
        });

        test('accepts Date object input', () => {
            const birthdate = new Date('1990-06-15');
            const age = calcAgeFromBirthdate(birthdate);

            expect(typeof age).toBe('number');
            expect(age).toBeGreaterThan(30);
        });
    });
});
