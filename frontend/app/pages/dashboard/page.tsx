'use client';

import { auth } from '@/app/lib/firebase';
import { getCurrentAccount } from '@/app/lib/getCurrentAccount';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/pages/login');
                return;
            }

            try {
                const account = await getCurrentAccount();

                if (!account.profile_completed) {
                    if (account.account_type === 'seeker') {
                        router.push('/pages/onboarding/seeker');
                        return;
                    }

                    if (account.account_type === 'recruiter') {
                        router.push('/pages/onboarding/recruiter');
                        return;
                    }
                }

                if (account.account_type === 'seeker') {
                    router.push('/pages/dashboard/seeker');
                    return;
                }

                if (account.account_type === 'recruiter') {
                    router.push('/pages/dashboard/recruiter');
                    return;
                }

                router.push('/pages/login');
            } catch (error) {
                console.error('Dashboard redirect error:', error);
                router.push('/pages/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FFF8DC] text-black">
            <p className="text-lg font-semibold">Opening your dashboard...</p>
        </div>
    );
}