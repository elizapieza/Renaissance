'use client';

import PageShell from '@/app/components/PageShell';
import ProtectedRoute from '@/app/components/protectedRoutes';
import { fetchRecruiterJobs } from '@/app/lib/swipeApi';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type RecruiterJob = {
    job_id: number;
    title: string;
    industry: string;
    location: string;
    min_pay: number;
    max_pay?: number | null;
    remote: boolean;
    required_education?: string;
    match_count: number;
};

export default function RecruiterSwipePage() {
    const [jobs, setJobs] = useState<RecruiterJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const data = await fetchRecruiterJobs();
                setJobs(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load recruiter jobs.');
            } finally {
                setLoading(false);
            }
        };

        loadJobs();
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
                title="Choose a Job to Review Applicants"
                description="Select a job post to start swiping through ranked applicants."
            >
                {loading ? (
                    <p className="text-lg font-semibold">Loading jobs...</p>
                ) : error ? (
                    <p className="text-red-600 font-semibold">{error}</p>
                ) : jobs.length === 0 ? (
                    <p className="text-lg font-semibold">You have no jobs posted yet.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {jobs.map((job) => (
                            <div
                                key={job.job_id}
                                className="rounded-xl border-4 border-black bg-[#FFF8D8] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <h2 className="text-xl font-bold">{job.title}</h2>
                                <p className="mt-2 text-sm text-gray-700">{job.industry}</p>
                                <p className="text-sm text-gray-700">{job.location}</p>
                                <p className="text-sm text-gray-700">Matches: {job.match_count}</p>

                                <Link
                                    href={`/pages/swipe/recruiter/${job.job_id}`}
                                    className="mt-4 inline-block rounded-md border-2 border-black bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-500"
                                >
                                    Review Applicants
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </PageShell>
        </ProtectedRoute>
    );
}