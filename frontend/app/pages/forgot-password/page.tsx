'use client';

import { useState } from 'react';

export default function forgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleForgotPassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Requesting password reset for:', email);
        setSubmitted(true);
    };

    return (
        <main className='relative flex min-h-screen items-center justify-center bg-[#FFFBEB]'>
            <section className='w-full max-w-md rounded-sm border-4 border-black bg-[#FFF8D8] p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]'>
        <h1 className='mb-3 text-3xl font-bold text-black'>Forgot Password</h1>
        <p className='mb-6 text-sm text-black/70'>
        Enter your email to reset your password.
        </p>

        {submitted ? (
            <div className='spaced-y-4'>
                <p className='text-sm text-gray-700'>
                    If an account with that email exists, we've sent you a password reset link.
                </p>
            </div>
        ) : (
            <form onSubmit={handleForgotPassword} className='space-y-5'>
                <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                        Email
                    </label>
                    <input
                        id='email'
                        type='email'
                        placeholder='email@email.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm'
                    />
                </div>

                <button
                    type='submit'
                    className='w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2'
                >
                    Send Reset Link
                </button>
            </form>
        )}
    </section>
</main>
    );
}