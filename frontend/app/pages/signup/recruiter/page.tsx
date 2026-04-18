'use client';

import PageShell from '@/app/components/PageShell';
import { auth } from '@/app/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignupRecruiterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    useEffect(() => {
        localStorage.setItem('role', 'recruiter');
        localStorage.setItem('profileComplete', 'false');
    }, []);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            const response = await fetch('http://127.0.0.1:8000/api/accounts/signup/recruiter/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Backend signup failed');
            }

            console.log('Backend signup success:', data);
            router.push('/pages/onboarding/recruiter');
        } catch (error: any) {
            console.error('Signup error:', error.message);
            setError(error.message);
        }
    };

    const inputClass =
        'w-full rounded-md border-2 border-black bg-white px-4 py-3 text-black outline-none transition focus:ring-4 focus:ring-yellow-300';

    const toggleButtonClass =
        'px-3 text-sm font-medium text-blue-600 hover:text-blue-800';

    return (
        <PageShell
            navBarVariant='loggedOut'
            title="Sign Up Today"
            description="Sign up to start finding qualified candidates and building your team."
        >
            <form onSubmit={handleSignup} className='space-y-6'>
                <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                        Email
                    </label>

                    <div className='mt-1 flex overflow-hidden rounded-md border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-gray-700'>
                        <input
                            id='email'
                            type='email'
                            placeholder='email@email.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={inputClass}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                        Password
                    </label>

                    <div className='mt-1 flex items-center overflow-hidden rounded-md border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-gray-700'>
                        <input
                            id='password'
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={inputClass}
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className={toggleButtonClass}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
                        Confirm Password
                    </label>

                    <div className='mt-1 flex items-center overflow-hidden rounded-md border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-gray-700'>
                        <input
                            id='confirmPassword'
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={inputClass}
                        />
                        <button
                            type='button'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={toggleButtonClass}
                        >
                            {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>

                {error && <div className='text-sm text-red-500'>{error}</div>}

                <div>
                    <button
                        type='submit'
                        className='w-full rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
                    >
                        Sign Up
                    </button>
                </div>
            </form>

            <p className='mt-4 text-center text-sm text-gray-700'>
                Already have an account?
                <Link href='/pages/login' className='p-2 font-medium text-yellow-500 hover:text-yellow-600'>
                    Log in
                </Link>
            </p>
        </PageShell>
    );
}