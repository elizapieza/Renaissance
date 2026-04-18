'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/firebase';
import { CurrentAccount, getCurrentAccount } from '@/app/lib/getCurrentAccount';

type ProtectedRouteProps = {
    children: React.ReactNode;
    allowedRoles?: Array<'seeker' | 'recruiter'>;
    requireProfileComplete?: boolean;

    redirectIfProfileComplete?: boolean;

    redirectSignedOutTo?: string;
    redirectWrongRoleTo?: string;
    redirectIncompleteProfileTo?: string;
    redirectCompletedProfileTo?: string;
};

export default function ProtectedRoute({
    children,
    allowedRoles,
    requireProfileComplete = false,
    redirectIfProfileComplete = false,
    redirectSignedOutTo = '/pages/login',
    redirectWrongRoleTo = '/pages/dashboard',
    redirectIncompleteProfileTo,
    redirectCompletedProfileTo = '/pages/dashboard',
}: ProtectedRouteProps) {
    const router = useRouter();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push(redirectSignedOutTo);
                return;
            }

            try {
                const account: CurrentAccount = await getCurrentAccount();

                localStorage.setItem('role', account.account_type);
                localStorage.setItem('profileComplete', String(account.profile_completed));

                if (
                    allowedRoles &&
                    allowedRoles.length > 0 &&
                    !allowedRoles.includes(account.account_type)
                ) {
                    router.push(redirectWrongRoleTo);
                    return;
                }

                if (requireProfileComplete && !account.profile_completed) {
                    if (redirectIncompleteProfileTo) {
                        router.push(redirectIncompleteProfileTo);
                        return;
                    }

                    if (account.account_type === 'seeker') {
                        router.push('/pages/onboarding/seeker');
                        return;
                    }

                    if (account.account_type === 'recruiter') {
                        router.push('/pages/onboarding/recruiter');
                        return;
                    }
                }

                if (redirectIfProfileComplete && account.profile_completed) {
                    router.push(redirectCompletedProfileTo);
                    return;
                }

                setAuthorized(true);
            } catch (error) {
                console.error('ProtectedRoute error:', error);
                router.push(redirectSignedOutTo);
            } finally {
                setCheckingAuth(false);
            }
        });

        return () => unsubscribe();
    }, [
        router,
        allowedRoles,
        requireProfileComplete,
        redirectIfProfileComplete,
        redirectSignedOutTo,
        redirectWrongRoleTo,
        redirectIncompleteProfileTo,
        redirectCompletedProfileTo,
    ]);

    if (checkingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FFF8DC] text-black">
                <p className="text-lg font-semibold">Checking your session...</p>
            </div>
        );
    }

    if (!authorized) {
        return null;
    }

    return <>{children}</>;
}