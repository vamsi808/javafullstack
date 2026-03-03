import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { z } from 'zod';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { getPasswordStrength } from '../../utils/validation';
import { clsx } from 'clsx';

const setPasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(64, 'Password must be at most 64 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const SetPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const { user, setInitialPassword } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(setPasswordSchema),
        mode: 'onChange',
    });

    const password = watch('password', '');
    const strength = getPasswordStrength(password);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await setInitialPassword(user.email, data.password);
            navigate('/portal');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-start to-background-end p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-success/20 rounded-xl flex items-center justify-center mb-4 border border-success/30">
                        <ShieldCheck className="text-success" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Set Your Password</h1>
                    <p className="text-slate-400 text-sm text-center">
                        Hi {user?.name}, please set a secure password for your new account.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        registration={register('password')}
                    />

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

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                        registration={register('confirmPassword')}
                    />

                    <button
                        type="submit"
                        disabled={!isValid || loading}
                        className={clsx(
                            "w-full py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2",
                            isValid && !loading ? "bg-primary hover:bg-primary-hover text-white" : "bg-slate-700 text-slate-400"
                        )}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Set Password & Continue"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default SetPasswordPage;
