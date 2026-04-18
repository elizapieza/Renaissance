'use client';

import { useEffect, useState } from 'react';
import PageShell from '@/app/components/PageShell';
import ProtectedRoute from '@/app/components/protectedRoutes';
import { fetchMatches } from '@/app/lib/swipeApi';

type RecruiterMatch = {
    match_id: number;
    job_id: number;
    job_title: string;
    seeker_id?: number;
    candidate_name?: string;
    created_at: string;
};

export default function RecruiterMatchPage() {
    const [matches, setMatches] = useState<RecruiterMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadMatches = async () => {
            try {
                const data = await fetchMatches();
                setMatches(data as RecruiterMatch[]);
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
            allowedRoles={['recruiter']}
            requireProfileComplete={true}
            redirectWrongRoleTo="/pages/dashboard"
        >
            <PageShell
                navBarVariant="recruiter"
                layout="board"
                title="Your Matches"
                description="These are the applicants who matched with one of your job posts."
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
                                <p className="mt-2 text-sm text-gray-700">
                                    Candidate #{match.seeker_id}
                                </p>
                                <p className="text-sm text-gray-700">{match.candidate_name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </PageShell>
        </ProtectedRoute>
    );
}