import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A highly reusable, accessible, and styleable Input component.
 * Supports standard input types, including password visibility toggling.
 * 
 * @param {Object} props - Component props.
 * @param {string} props.label - Label for the input.
 * @param {string} props.error - Error message to display.
 * @param {string} props.type - Input type (text, password, etc.).
 * @param {string} props.className - Additional classes for the input.
 * @param {Object} props.registration - React Hook Form registration object.
 */
const Input = ({ label, error, type = 'text', className, registration, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-sm font-medium text-slate-300">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    className={twMerge(
                        clsx(
                            "w-full px-4 py-3 bg-slate-800/50 border rounded-lg outline-none transition-all duration-300 text-white placeholder:text-slate-500",
                            "border-slate-700 hover:border-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20",
                            error && "border-danger focus:border-danger focus:ring-danger/20",
                            className
                        )
                    )}
                    {...registration}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && (
                <span className="text-xs text-danger animate-shake">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
