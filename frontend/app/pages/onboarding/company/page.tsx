'use client';

import { auth } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CompanyOnboardingPage() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState('');
    const [location, setLocation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [bio, setBio] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        localStorage.setItem('role', 'recruiter');
        localStorage.setItem('profileComplete', 'false');
    }, []);

    const handleProfileSubmit = async () => {
        setMessage('');
        setError('');

        try {
            const user = auth.currentUser;

            if (!user) {
                setError('User not authenticated. Please log in again.');
                return;
            }
            
            const idToken = await user.getIdToken();
            const response = await fetch("http://127.0.0.1:8000/api/accounts/onboarding/company/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken,
                    companyName,
                    location,
                    companyWebsite,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Profile update failed');
            }

            localStorage.setItem('profileComplete', 'true');
            setMessage('Profile updated successfully!');
            console.log('Profile update success:', data);
            router.push('/company')

        } catch (error: any) {
            console.error('Profile update error:', error.message);
            setError(error.message);
        }
    };
}