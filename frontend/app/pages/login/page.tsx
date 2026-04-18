'use client';

import PageShell from '@/app/components/PageShell';
import { auth } from '@/app/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const idToken = await user.getIdToken();

            const response = await fetch('http://127.0.0.1:8000/api/accounts/me/', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch account data');
            }

            localStorage.setItem('role', data.account_type);
            localStorage.setItem('profileComplete', String(data.profile_completed));

            if (!data.profile_completed) {
                if (data.account_type === 'seeker') {
                    router.push('/pages/onboarding/seeker');
                } else if (data.account_type === 'recruiter') {
                    router.push('/pages/onboarding/recruiter');
                } else {
                    router.push('/pages/login');
                }
            } else {
                router.push('/pages/dashboard');
            }

        } catch (err: any) {
            console.error('Login error:', err);

            if (err.code === 'auth/invalid-credential') {
                setError('The email or password is incorrect.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError(err.message || 'Something went wrong while logging in.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageShell
            navBarVariant="loggedOut"
            layout="auth"
            title="Welcome Back"
            description="Log in to continue exploring opportunities and connections."
        >
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-semibold text-black">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@email.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-md border-2 border-black bg-white px-4 py-3 text-black outline-none transition focus:ring-4 focus:ring-yellow-300"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-semibold text-black">
                        Password
                    </label>

                    <div className="flex items-center rounded-md border-2 border-black bg-white focus-within:ring-4 focus-within:ring-yellow-300">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            className="w-full bg-transparent px-4 py-3 text-black outline-none"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="px-4 py-2 text-sm font-semibold text-[#8A6500] hover:underline"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="rounded-md border-2 border-red-700 bg-red-100 px-4 py-3 text-sm font-medium text-red-900"
                    >
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md border-2 border-black bg-[#E6B819] px-4 py-3 text-base font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:translate-y-[-1px] hover:bg-[#d4a915] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? 'Logging In...' : 'Log In'}
                </button>

                <div className="flex flex-col items-center gap-2 pt-2 text-sm text-black md:flex-row md:justify-center">
                    <span>Don&apos;t have an account?</span>
                    <Link
                        href="/pages/signup"
                        className="font-semibold text-[#8A6500] hover:underline"
                    >
                        Sign up
                    </Link>
                </div>

                <div className="text-center text-sm">
                    <Link
                        href="/pages/forgot-password"
                        className="font-semibold text-[#8A6500] hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>
            </form>
        </PageShell>
    );
}