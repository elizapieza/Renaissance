'use client';

import PageShell from '@/app/components/PageShell';
import ProtectedRoute from '@/app/components/protectedRoutes';
import { fetchMatches } from '@/app/lib/swipeApi';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type SeekerMatch = {
    match_id: number;
    job_id: number;
    job_title: string;
    company_name?: string;
    location?: string;
    created_at: string;
};

export default function SeekerDashboardPage() {
    const [matches, setMatches] = useState<SeekerMatch[]>([]);
    const [loadingMatches, setLoadingMatches] = useState(true);
    const [matchError, setMatchError] = useState('');

    useEffect(() => {
        const loadMatches = async () => {
            try {
                const data = await fetchMatches();
                setMatches(data as SeekerMatch[]);
            } catch (error: any) {
                console.error('Failed to load seeker matches:', error);
                setMatchError(error.message || 'Failed to load matches.');
            } finally {
                setLoadingMatches(false);
            }
        };

        loadMatches();
    }, []);

    return (
        <ProtectedRoute
            allowedRoles={['seeker']}
            requireProfileComplete={true}
            redirectSignedOutTo="/pages/login"
            redirectWrongRoleTo="/pages/dashboard"
            redirectIncompleteProfileTo="/pages/onboarding/seeker"
        >
            <PageShell
                navBarVariant="seeker"
                layout="board"
                title="Your Dashboard"
                description="Review your matches, manage your profile, and continue exploring opportunities."
            >
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <section className="rounded-xl border-4 border-black bg-[#FFF8D8] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-bold">Recent Matches</h2>

                        {loadingMatches ? (
                            <p className="mt-3 text-sm text-gray-700">Loading matches...</p>
                        ) : matchError ? (
                            <p className="mt-3 text-sm font-semibold text-red-600">{matchError}</p>
                        ) : matches.length === 0 ? (
                            <p className="mt-3 text-sm text-gray-700">No matches yet.</p>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {matches.slice(0, 3).map((match) => (
                                    <div
                                        key={match.match_id}
                                        className="rounded-lg border-2 border-black bg-white p-3"
                                    >
                                        <p className="font-semibold">{match.job_title}</p>
                                        <p className="text-sm text-gray-700">{match.company_name}</p>
                                        <p className="text-sm text-gray-700">{match.location}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Link
                            href="/pages/match/seeker"
                            className="mt-4 inline-block rounded-md border-2 border-black bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-500"
                        >
                            View All Matches
                        </Link>
                    </section>

                    <section className="rounded-xl border-4 border-black bg-[#FFF8D8] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-bold">Continue Swiping</h2>
                        <p className="mt-3 text-sm text-gray-700">
                            Find more opportunities that fit your goals.
                        </p>

                        <Link
                            href="/pages/swipe/seeker"
                            className="mt-4 inline-block rounded-md border-2 border-black bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-500"
                        >
                            Go to Swipe
                        </Link>
                    </section>

                    <section className="rounded-xl border-4 border-black bg-[#FFF8D8] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-bold">Summary</h2>
                        <div className="mt-4 space-y-2 text-sm text-gray-800">
                            <p>Total Matches: {matches.length}</p>
                            <p>Status: Profile Complete</p>
                        </div>
                    </section>

                    <section className="md:col-span-2 xl:col-span-3 flex justify-center">
                        <div className="w-full max-w-2xl rounded-xl border-4 border-black bg-[#FFF8D8] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-xl font-bold">Profile</h2>
                            <p className="mt-2 text-sm text-gray-700">
                                Keep your information updated to improve your ranking and match quality.
                            </p>

                            <div className="mt-4 flex gap-3">
                                <button className="rounded-md border-2 border-black bg-yellow-400 px-4 py-2 font-semibold hover:bg-yellow-500">
                                    Review Profile
                                </button>

                                <button className="rounded-md border-2 border-black bg-yellow-400 px-4 py-2 font-semibold hover:bg-yellow-500">
                                    View Matches
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </PageShell>
        </ProtectedRoute>
    );
}