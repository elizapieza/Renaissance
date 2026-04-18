'use client';

import { useEffect, useState } from 'react';
import PageShell from '@/app/components/PageShell';
import ProtectedRoute from '@/app/components/protectedRoutes';
import { fetchMatches } from '@/app/lib/swipeApi';

type SeekerMatch = {
    match_id: number;
    job_id: number;
    job_title: string;
    company_name?: string;
    location?: string;
    created_at: string;
};

export default function SeekerMatchPage() {
    const [matches, setMatches] = useState<SeekerMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadMatches = async () => {
            try {
                const data = await fetchMatches();
                setMatches(data as SeekerMatch[]);
            } catch (err: any) {
                setError(err.message || 'Failed to load matches.');
            } finally {
                setLoading(false);
            }
        };

        loadMatches();
    }, []);

    return (
        <ProtectedRoute
            allowedRoles={['seeker']}
            requireProfileComplete={true}
            redirectWrongRoleTo="/pages/dashboard"
        >
            <PageShell
                navBarVariant="seeker"
                layout="board"
                title="Your Matches"
                description="These are the jobs where both sides said yes."
            >
                {loading ? (
                    <p className="text-lg font-semibold">Loading matches...</p>
                ) : error ? (
                    <p className="text-red-600 font-semibold">{error}</p>
                ) : matches.length === 0 ? (
                    <p className="text-lg font-semibold">No matches yet.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {matches.map((match) => (
                            <div
                                key={match.match_id}
                                className="rounded-xl border-4 border-black bg-[#FFF8D8] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <h2 className="text-xl font-bold">{match.job_title}</h2>
                                <p className="mt-2 text-sm text-gray-700">{match.company_name}</p>
                                <p className="text-sm text-gray-700">{match.location}</p>
                            </div>
                        ))}
                    </div>
                )}
            </PageShell>
        </ProtectedRoute>
    );
}