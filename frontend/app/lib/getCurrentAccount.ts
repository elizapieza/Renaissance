import { auth } from '@/app/lib/firebase';

export type CurrentAccount = {
    account_id: number;
    firebase_uid: string;
    email: string;
    account_type: 'seeker' | 'recruiter';
    profile_completed: boolean;
};

export async function getCurrentAccount(): Promise<CurrentAccount> {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No authenticated user found.');
    }

    const idToken = await user.getIdToken();

    const response = await fetch('http://127.0.0.1:8000/api/accounts/me/', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch current account.');
    }

    return data;
}