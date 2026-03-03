import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Github, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { loginSchema, getPasswordStrength } from '../../utils/validation';
import Input from '../../components/common/Input';

/**
 * Premium Login Page with Glassmorphism, Animations, and robust Validation.
 * Features:
 * - Zod-based validation
 * - Framer Motion animations
 * - Password strength indicator
 * - Rate limiting simulation (lock after 5 attempts)
 * - Social login placeholders
 */
const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockTime, setLockTime] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    });

    const password = watch('password', '');
    const strength = getPasswordStrength(password);

    // Handle rate limiting logic
    useEffect(() => {
        let timer;
        if (isLocked && lockTime > 0) {
            timer = setInterval(() => {
                setLockTime((prev) => prev - 1);
            }, 1000);
        } else if (lockTime === 0) {
            setIsLocked(false);
            setAttempts(0);
        }
        return () => clearInterval(timer);
    }, [isLocked, lockTime]);

    const onSubmit = async (data) => {
        if (isLocked) return;

        setLoading(true);
        setServerError(null);

        // Simulate server delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulate "Invalid Credentials" and Rate Limiting
        if (data.email !== 'admin@freshdesk.com' || data.password !== 'Admin@123') {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts >= 5) {
                setIsLocked(true);
                setLockTime(10); // Lock for 10 seconds as per requirement
                setServerError('Too many failed attempts. Account locked for 10s.');
            } else {
                setServerError('Invalid email or password. Please try again.');
            }
            setLoading(false);
            return;
        }

        // Success logic placeholder
        console.log('Login successful!', data);
        setLoading(false);
        // Redirect logic would go here
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-start to-background-end p-4 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 relative">
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                            className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-4 border border-primary/30"
                        >
                            <LogIn className="text-primary" size={32} />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400 text-sm">Secure access to your helpdesk</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@example.com"
                            error={errors.email?.message}
                            registration={register('email')}
                            disabled={loading || isLocked}
                        />

                        <div className="space-y-2">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                error={errors.password?.message}
                                registration={register('password')}
                                disabled={loading || isLocked}
                            />

                            {/* Strength Indicator */}
                            {password && (
                                <div className="flex gap-1 h-1 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={clsx(
                                                "flex-1 rounded-full transition-all duration-300",
                                                i < strength
                                                    ? strength <= 2 ? "bg-danger" : strength <= 4 ? "bg-amber-400" : "bg-success"
                                                    : "bg-slate-700"
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <AnimatePresence mode="wait">
                            {serverError && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm"
                                >
                                    <AlertCircle size={16} />
                                    <span>{serverError} {isLocked && `(${lockTime}s)`}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={!isValid || loading || isLocked}
                            className={clsx(
                                "w-full py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg",
                                isValid && !loading && !isLocked
                                    ? "bg-primary hover:bg-primary-hover text-white shadow-primary/20"
                                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Social Logins */}
                    <div className="mt-8">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700/50"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-slate-500 backdrop-blur-md">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-slate-500 transition-all text-white text-sm font-medium">
                                <Github size={18} />
                                GitHub
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-slate-500 transition-all text-white text-sm font-medium">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                        </div>
                    </div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-6 text-slate-500 text-sm"
                >
                    Don't have an account? <a href="#" className="text-primary hover:underline transition-all">Request access</a>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
