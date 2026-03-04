import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { signupSchema, getPasswordStrength } from '../../utils/validation';
import Input from '../../components/common/Input';
import api from '../../services/api';

const SignupPage = () => {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(signupSchema),
        mode: 'onChange',
    });

    const password = watch('password', '');
    const strength = getPasswordStrength(password);

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError(null);

        try {
            await api.post('/auth/register', data);
            setSuccess(true);
        } catch (err) {
            setServerError(err.response?.data?.message || err.response?.data || 'Failed to register account.');
        } finally {
            setLoading(false);
        }
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
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 relative">
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                            className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-4 border border-primary/30"
                        >
                            <UserPlus className="text-primary" size={32} />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
                        <p className="text-slate-400 text-sm text-center">Join the helpdesk to raise tickets</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center space-y-4 py-8"
                            >
                                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle className="text-success" size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-white">Registration Successful!</h2>
                                <p className="text-slate-400 text-sm">
                                    Your account has been created and is currently pending administrator approval. You will be able to log in once an admin verifies your account.
                                </p>
                                <Link to="/login" className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium border border-slate-700 transition-all block w-full">
                                    Return to Login
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.form
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <Input
                                    label="Full Name"
                                    type="text"
                                    placeholder="John Doe"
                                    error={errors.name?.message}
                                    registration={register('name')}
                                    disabled={loading}
                                />

                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="name@example.com"
                                    error={errors.email?.message}
                                    registration={register('email')}
                                    disabled={loading}
                                />

                                <div className="space-y-2">
                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        error={errors.password?.message}
                                        registration={register('password')}
                                        disabled={loading}
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
                                            <span>{serverError}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    type="submit"
                                    disabled={!isValid || loading}
                                    className={clsx(
                                        "w-full py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg",
                                        isValid && !loading
                                            ? "bg-primary hover:bg-primary-hover text-white shadow-primary/20"
                                            : "bg-slate-700 text-slate-400 cursor-not-allowed"
                                    )}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            <UserPlus size={20} />
                                            <span>Create Account</span>
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                {!success && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center mt-6 text-slate-500 text-sm"
                    >
                        Already have an account? <Link to="/login" className="text-primary hover:underline transition-all">Sign in here</Link>
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};

export default SignupPage;
