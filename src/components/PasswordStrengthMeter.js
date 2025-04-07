import React from 'react';
import { passwordCriteria } from '@/validation/validationUtils';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const getStrengthLabel = (score) => {
  if (score <= 2) return { label: 'Weak', color: 'text-red-500', bar: 'bg-red-500' };
  if (score === 3 || score === 4)
    return { label: 'Medium', color: 'text-yellow-500', bar: 'bg-yellow-500' };
  return { label: 'Strong', color: 'text-green-500', bar: 'bg-green-500' };
};

export default function PasswordStrengthMeter({ password }) {
  if (!password) return null;

  const passed = passwordCriteria.filter((rule) => rule.test(password));
  const score = passed.length;
  const { label, color, bar } = getStrengthLabel(score);

  return (
    <div className="w-full mt-4 space-y-4" aria-live="polite" data-testid="password-strength-meter">
      {/* Strength Meter */}
      <div>
        <div
          className="flex justify-between text-xs font-extrabold font-heading text-gray-600 mb-1"
          data-testid="strength-label"
        >
          <span>Password Strength</span>
          <span className={`font-bold ${color}`} data-testid="strength-value">
            {label.toUpperCase()}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            data-testid="strength-bar"
            className={`h-full ${bar} rounded transition-all duration-300 ease-in-out`}
            style={{ width: `${(score / passwordCriteria.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <fieldset
        className="bg-gray-50 rounded-md p-3 border border-gray-200"
        data-testid="checklist"
      >
        <legend className="sr-only">Password Requirements</legend>
        <ul className="text-xs space-y-1">
          {passwordCriteria.map((rule, idx) => {
            const isPassed = rule.test(password);
            return (
              <li
                key={idx}
                className={`flex items-center gap-2 transition-opacity duration-300 ${
                  isPassed ? 'opacity-100' : 'opacity-70'
                }`}
                data-testid={`rule-${idx}`}
              >
                {isPassed ? (
                  <FaCheckCircle className="text-green-500" aria-label="Passed" />
                ) : (
                  <FaTimesCircle className="text-red-500" aria-label="Failed" />
                )}
                <span className={isPassed ? 'text-green-700' : 'text-red-500'}>{rule.label}</span>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}
