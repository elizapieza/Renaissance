'use client';

import SwipeCard from '@/app/components/card';
import JobCardContent from '@/app/components/jobCard';
import PageShell from '@/app/components/PageShell';
import ProtectedRoute from '@/app/components/protectedRoutes';
import { fetchRankedJobs, submitJobSwipe } from '@/app/lib/swipeApi';
import { useEffect, useState } from 'react';

type JobCard = {
    job_id: number;
    title: string;
    company?: string;
    industry: string;
    location: string;
    educationLevel?: string;
    qualifications?: string;
    requirements?: string;
    description: string;
    remote: boolean;
    minPay: number;
    rankingScore: number;
};

export default function SeekerSwipePage() {
    const [cards, setCards] = useState<JobCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const jobs = await fetchRankedJobs();
                setCards(jobs);
            } catch (err: any) {
                setError(err.message || 'Failed to load jobs.');
            } finally {
                setLoading(false);
            }
        };

        loadJobs();
    }, []);

    const handleSwipe = async (action: 'yes' | 'no' | 'save') => {
        if (currentIndex >= cards.length) return;

        try {
            setSubmitting(true);
            setError('');

            const currentCard = cards[currentIndex];
            await submitJobSwipe(currentCard.job_id, action);

            setCurrentIndex((prev) => prev + 1);
        } catch (err: any) {
            setError(err.message || 'Failed to save swipe.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ProtectedRoute
            allowedRoles={['seeker']}
            requireProfileComplete={true}
            redirectWrongRoleTo="/pages/dashboard"
        >
            <PageShell
                navBarVariant="seeker"
                layout="immersive"
                title="Swipe Jobs"
                description="Review one opportunity at a time."
            >
                {loading ? (
                    <p className="text-center text-lg font-semibold">Loading jobs...</p>
                ) : error ? (
                    <p className="text-center text-red-600 font-semibold">{error}</p>
                ) : currentIndex >= cards.length ? (
                    <p className="text-center text-2xl font-bold">That’s it for now folks.</p>
                ) : (
                    <div className="flex flex-col items-center gap-6">
                        <SwipeCard>
                            <JobCardContent
                                title={cards[currentIndex].title}
                                industry={cards[currentIndex].industry}
                                location={cards[currentIndex].location}
                                minPay={cards[currentIndex].minPay}
                                maxPay={null}
                                remote={cards[currentIndex].remote}
                                educationLevel={cards[currentIndex].educationLevel || ''}
                                qualifications={(cards[currentIndex].qualifications || '')
                                    .split(',')
                                    .map((item) => item.trim())
                                    .filter((item) => item !== '')}

                                skills={(cards[currentIndex].requirements || '')
                                    .split(',')
                                    .map((item) => item.trim())
                                    .filter((item) => item !== '')}
                                description={cards[currentIndex].description}
                            />
                        </SwipeCard>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                disabled={submitting}
                                onClick={() => handleSwipe('no')}
                                className="px-5 py-3 rounded-2xl bg-black text-white disabled:opacity-60"
                            >
                                No
                            </button>

                            <button
                                type="button"
                                disabled={submitting}
                                onClick={() => handleSwipe('save')}
                                className="px-5 py-3 rounded-2xl bg-yellow-400 text-black disabled:opacity-60"
                            >
                                Save
                            </button>

                            <button
                                type="button"
                                disabled={submitting}
                                onClick={() => handleSwipe('yes')}
                                className="px-5 py-3 rounded-2xl bg-yellow-200 text-black disabled:opacity-60"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                )}
            </PageShell>
        </ProtectedRoute>
    );
}