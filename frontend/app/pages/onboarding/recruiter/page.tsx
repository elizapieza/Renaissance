"use client";

import PageShell from '@/app/components/PageShell';
import ProtectedRoute from '@/app/components/protectedRoutes';
import { auth } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RecruiterOnboardingPage() {
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [location, setLocation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [bio, setBio] = useState('');
    const [title, setTitle] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showOwnerPopup, setShowOwnerPopup] = useState(false);
    const [createdCompanyId, setCreatedCompanyId] = useState<number | null>(null);

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

            const response = await fetch("http://127.0.0.1:8000/api/accounts/onboarding/recruiter/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken,
                    firstName,
                    lastName,
                    location,
                    phoneNumber,
                    bio,
                    title,
                    companyName,
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

            if (data.company_created) {
                setCreatedCompanyId(data.company_id);
                setShowOwnerPopup(true);
            } else {
                router.push('/company');
            }
        } catch (error: any) {
            console.error('Profile update error:', error.message);
            setError(error.message);
        }
    };

    const handleOwnershipChoice = async (isOwner: boolean) => {
        try {
            setError('');

            const user = auth.currentUser;

            if (!user) {
                setError('User not authenticated. Please log in again.');
                return;
            }

            if (!createdCompanyId) {
                setError('Company ID is missing.');
                return;
            }

            const idToken = await user.getIdToken();

            const response = await fetch("http://127.0.0.1:8000/api/accounts/company/confirm-ownership/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken,
                    companyId: createdCompanyId,
                    isOwner,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save ownership choice.');
            }

            console.log('Ownership choice saved:', data);
            setShowOwnerPopup(false);

            if (isOwner) {
                router.push('/company');
            } else {
                router.push('/pages/dashboard/recruiter');
            }
        } catch (error: any) {
            console.error('Ownership choice error:', error.message);
            setError(error.message);
        }
    };

    const inputClass =
        'border-2 border-black bg-white p-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-yellow-500';

    return (
        <ProtectedRoute
            allowedRoles={['recruiter']}
            redirectIfProfileComplete={true}
            redirectCompletedProfileTo="/pages/dashboard/recruiter"
            redirectWrongRoleTo="/pages/dashboard"
        >
            <PageShell
                navBarVariant="recruiter"
                layout="form"
                title="Complete Your Profile"
                description="Fill out your profile information to connect with qualified candidates and build your company presence."
            >
                <p className="mb-4 text-sm font-medium text-gray-700">
                    Step 3 of 3: Complete your recruiter profile
                </p>

                <div className={showOwnerPopup ? "pointer-events-none select-none blur-sm" : ""}>
                    <div className="flex flex-col gap-4 text-black">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-black">First Name</label>
                                <input
                                    autoComplete="on"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-black">Last Name</label>
                                <input
                                    autoComplete="on"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black">Phone Number</label>
                            <input
                                autoComplete="on"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black">Job Title</label>
                            <input
                                autoComplete="on"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Hiring Manager"
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black">Short Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell candidates a little about yourself."
                                className={inputClass}
                                rows={4}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black">Company Name</label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black">Company Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black">Company Website</label>
                            <input
                                type="text"
                                value={companyWebsite}
                                onChange={(e) => setCompanyWebsite(e.target.value)}
                                placeholder="https://example.com"
                                className={inputClass}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleProfileSubmit}
                            className="rounded-md border-2 border-black bg-yellow-500 px-4 py-2 font-semibold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-600"
                        >
                            Save Profile
                        </button>

                        {message && <p className="text-green-600">{message}</p>}
                        {error && <p className="text-red-600">{error}</p>}
                    </div>
                </div>

                {showOwnerPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="relative w-full max-w-md rounded-xl border-2 border-black bg-white p-6 text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="absolute right-3 top-3 h-4 w-4 rotate-12 border border-black bg-yellow-300" />

                            <h2 className="mb-3 text-xl font-bold">New Company Found</h2>

                            <p className="mb-4">
                                <span className="font-semibold">{companyName}</span> looks like a new company in our system.
                                Do you own this company?
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => handleOwnershipChoice(false)}
                                    className="rounded-md border-2 border-black bg-gray-200 px-4 py-2 hover:bg-gray-300"
                                >
                                    No
                                </button>

                                <button
                                    onClick={() => handleOwnershipChoice(true)}
                                    className="rounded-md border-2 border-black bg-yellow-500 px-4 py-2 font-semibold text-black hover:bg-yellow-600"
                                >
                                    Yes, I own it
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </PageShell>
        </ProtectedRoute>
    );
}