'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PageShell from '@/app/components/PageShell';
import ProtectedRoute from '@/app/components/protectedRoutes';
import SwipeCard from '@/app/components/card';
import { fetchRankedApplicants, submitCandidateSwipe } from '@/app/lib/swipeApi';

type RankedApplicant = {
    userId: number;
    firstName?: string;
    lastName?: string;
    educationLevel?: string;
    skills?: string;
    experience?: string;
    bio?: string;
    rankingScore: number;
};

export default function RecruiterApplicantSwipePage() {
    const params = useParams();
    const jobId = Number(params.jobId);

    const [applicants, setApplicants] = useState<RankedApplicant[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadApplicants = async () => {
            try {
                const data = await fetchRankedApplicants(jobId);
                setApplicants(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load applicants.');
            } finally {
                setLoading(false);
            }
        };

        if (!Number.isNaN(jobId)) {
            loadApplicants();
        }
    }, [jobId]);

    const handleSwipe = async (action: 'yes' | 'no' | 'save') => {
        if (currentIndex >= applicants.length) return;

        try {
            setSubmitting(true);
            setError('');

            const currentApplicant = applicants[currentIndex];
            await submitCandidateSwipe(currentApplicant.userId, jobId, action);

            setCurrentIndex((prev) => prev + 1);
        } catch (err: any) {
            setError(err.message || 'Failed to save applicant swipe.');
        } finally {
            setSubmitting(false);
        }
    };

    const currentApplicant = applicants[currentIndex];

    return (
        <ProtectedRoute
            allowedRoles={['recruiter']}
            requireProfileComplete={true}
            redirectWrongRoleTo="/pages/dashboard"
        >
            <PageShell
                navBarVariant="recruiter"
                layout="immersive"
                title="Review Applicants"
                description="Swipe through ranked applicants for this job."
            >
                {loading ? (
                    <p className="text-center text-lg font-semibold">Loading applicants...</p>
                ) : error ? (
                    <p className="text-center text-red-600 font-semibold">{error}</p>
                ) : currentIndex >= applicants.length ? (
                    <p className="text-center text-2xl font-bold">No more applicants right now.</p>
                ) : (
                    <div className="flex flex-col items-center gap-6">
                        <SwipeCard>
                            <div className="flex flex-col gap-4 text-black">
                                <h2 className="text-2xl font-bold">
                                    Candidate #{currentApplicant.userId}
                                </h2>

                                <p>
                                    <span className="font-semibold">Education:</span>{' '}
                                    {currentApplicant.educationLevel || 'Not provided'}
                                </p>

                                <p>
                                    <span className="font-semibold">Skills:</span>{' '}
                                    {currentApplicant.skills || 'Not provided'}
                                </p>

                                <p>
                                    <span className="font-semibold">Experience:</span>{' '}
                                    {currentApplicant.experience || 'Not provided'}
                                </p>

                                <p>
                                    <span className="font-semibold">Bio:</span>{' '}
                                    {currentApplicant.bio || 'Not provided'}
                                </p>

                                <p>
                                    <span className="font-semibold">Ranking Score:</span>{' '}
                                    {currentApplicant.rankingScore?.toFixed?.(2) ?? currentApplicant.rankingScore}
                                </p>
                            </div>
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