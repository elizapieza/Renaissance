'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getCurrentAccount } from '@/app/lib/getCurrentAccount';

export default function MatchRedirectPage() {
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
                    router.push('/pages/match/seeker');
                    return;
                }

                if (account.account_type === 'recruiter') {
                    router.push('/pages/match/recruiter');
                    return;
                }

                router.push('/pages/login');
            } catch (error) {
                console.error('Match redirect error:', error);
                router.push('/pages/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FFF8DC] text-black">
            <p className="text-lg font-semibold">Opening matches...</p>
        </div>
    );
}