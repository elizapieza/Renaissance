'use client';

import PageShell from '@/app/components/PageShell';
import { auth } from '@/app/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignupSeekerPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const [error, setError] = useState('');
    useEffect(() => {
        localStorage.setItem('role', 'seeker');
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
            
            const response = await fetch("http://127.0.0.1:8000/api/accounts/signup/seeker/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken }),
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Backend signup failed");
            }

            console.log("Backend signup success:", data);
            router.push('/pages/onboarding/seeker');
        } catch (error: any) {
            console.error('Signup error:', error.message);
            setError(error.message);
        }
    };

return (
    <PageShell 
        navBarVariant='loggedOut'
        title="Sign Up Today"
        description="Sign Up to start exploring opportunities and connections"
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
                className="w-full rounded-md border-2 border-black bg-white px-4 py-3 text-black outline-none transition focus:ring-4 focus:ring-yellow-300"
            />
        </div>
        </div>

            <div>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
                <div className='mt-1 flex overflow-hidden rounded-md border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-gray-700'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full rounded-md border-2 border-black bg-white px-4 py-3 text-black outline-none transition focus:ring-4 focus:ring-yellow-300"
                    />
                    <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='text-sm text-blue-600 hover:text-blue-800'
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>Confirm Password</label>
                <div className='mt-1 flex overflow-hidden rounded-md border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-gray-700'>
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id='confirmPassword'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full rounded-md border-2 border-black bg-white px-4 py-3 text-black outline-none transition focus:ring-4 focus:ring-yellow-300"
                    />
                    <button
                        type='button'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className='text-sm text-blue-600 hover:text-blue-800'
                    >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>

            {error && (
                <div className='text-red-500 text-sm'>{error}</div>
            )}

            <div>
                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
                >
                    Sign Up
                </button>
            </div>
        </form>

        <p className='mt-4 text-center text-sm text-gray-700'>
            Already have an account?{''}
            <Link href='/pages/login' className='font-medium text-yellow-500 hover:text-yellow-600 p-5'>
                Log in
            </Link>
        </p>
    </PageShell>
);
    }