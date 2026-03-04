import { z } from 'zod';

/**
 * Validation schema for the Login form.
 * Enforces strict security requirements as per the objective.
 */
export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(5, 'Email must be at least 5 characters')
        .max(50, 'Email must be at most 50 characters')
        .email('Invalid email address format'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(64, 'Password must be at most 64 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character')
        .refine((val) => !val.startsWith(' ') && !val.endsWith(' '), {
            message: 'Leading and trailing spaces are not allowed',
        }),
});

export const signupSchema = loginSchema.extend({
    name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters')
});

/**
 * Simple password strength calculator.
 */
export const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength; // Scale 0-5
};
