'use client';

import PageShell from '@/app/components/PageShell';
import { fetchMatches, fetchRecruiterJobs } from '@/app/lib/swipeApi';
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
    posted_by_me?: boolean;
    posted_by_name?: string;
};

type RecruiterMatch = {
    match_id: number;
    job_id: number;
    job_title: string;
    seeker_id?: number;
    candidate_name?: string;
    created_at: string;
};

type JobScope = 'all' | 'mine' | 'others';

export default function RecruiterDashboardPage() {
    const [jobs, setJobs] = useState<RecruiterJob[]>([]);
    const [matches, setMatches] = useState<RecruiterMatch[]>([]);
    const [jobScope, setJobScope] = useState<JobScope>('all');

    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingMatches, setLoadingMatches] = useState(true);

    const [jobError, setJobError] = useState('');
    const [matchError, setMatchError] = useState('');

    useEffect(() => {
        const loadJobs = async () => {
            try {
                setLoadingJobs(true);
                setJobError('');
                const data = await fetchRecruiterJobs(jobScope);
                setJobs(data);
            } catch (err: any) {
                setJobError(err.message || 'Failed to load jobs.');
            } finally {
                setLoadingJobs(false);
            }
        };

        loadJobs();
    }, [jobScope]);

    useEffect(() => {
        const loadMatches = async () => {
            try {
                const data = await fetchMatches();
                setMatches(data as RecruiterMatch[]);
            } catch (err: any) {
                setMatchError(err.message || 'Failed to load matches.');
            } finally {
                setLoadingMatches(false);
            }
        };

        loadMatches();
    }, []);

    return (
        <PageShell
            navBarVariant="recruiter"
            layout="board"
            title="Recruiter Dashboard"
            description="Manage company job posts, review applicants, and track your matches."
        >
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <section className="rounded-xl border-4 border-black bg-[#FFF8D8] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:col-span-2">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-xl font-bold">Company Jobs</h2>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setJobScope('all')}
                                className={`rounded-md border-2 border-black px-3 py-2 text-sm font-semibold ${
                                    jobScope === 'all'
                                        ? 'bg-yellow-400 text-black'
                                        : 'bg-white text-black hover:bg-yellow-100'
                                }`}
                            >
                                All Jobs
                            </button>

                            <button
                                type="button"
                                onClick={() => setJobScope('mine')}
                                className={`rounded-md border-2 border-black px-3 py-2 text-sm font-semibold ${
                                    jobScope === 'mine'
                                        ? 'bg-yellow-400 text-black'
                                        : 'bg-white text-black hover:bg-yellow-100'
                                }`}
                            >
                                My Jobs
                            </button>

                            <button
                                type="button"
                                onClick={() => setJobScope('others')}
                                className={`rounded-md border-2 border-black px-3 py-2 text-sm font-semibold ${
                                    jobScope === 'others'
                                        ? 'bg-yellow-400 text-black'
                                        : 'bg-white text-black hover:bg-yellow-100'
                                }`}
                            >
                                Others&apos; Jobs
                            </button>

                            <Link
                                href="/pages/jobPost"
                                className="rounded-md border-2 border-black bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-500"
                            >
                                Post a Job
                            </Link>
                        </div>
                    </div>

                    {loadingJobs ? (
                        <p className="mt-3 text-sm text-gray-700">Loading jobs...</p>
                    ) : jobError ? (
                        <p className="mt-3 text-sm font-semibold text-red-600">{jobError}</p>
                    ) : jobs.length === 0 ? (
                        <div className="mt-4 rounded-lg border-2 border-black bg-white p-4">
                            <p className="text-sm text-gray-700">
                                No jobs found for this view yet.
                            </p>
                            <Link
                                href="/pages/jobPost"
                                className="mt-3 inline-block rounded-md border-2 border-black bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-500"
                            >
                                Post Your First Job
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            {jobs.slice(0, 4).map((job) => (
                                <div
                                    key={job.job_id}
                                    className="rounded-lg border-2 border-black bg-white p-4"
                                >
                                    <h3 className="text-lg font-bold">{job.title}</h3>
                                    <p className="text-sm text-gray-700">{job.industry}</p>
                                    <p className="text-sm text-gray-700">{job.location}</p>
                                    <p className="text-sm text-gray-700">
                                        Matches: {job.match_count}
                                    </p>

                                    {job.posted_by_name && (
                                        <p className="mt-1 text-sm text-gray-700">
                                            {job.posted_by_me ? 'Posted by you' : `Posted by ${job.posted_by_name}`}
                                        </p>
                                    )}

                                    <Link
                                        href={`/pages/swipe/recruiter/${job.job_id}`}
                                        className="mt-3 inline-block rounded-md border-2 border-black bg-yellow-400 px-3 py-2 text-sm font-semibold text-black hover:bg-yellow-500"
                                    >
                                        Review Applicants
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-xl border-4 border-black bg-[#FFF8D8] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-xl font-bold">Recent Matches</h2>

                    {loadingMatches ? (
                        <p className="mt-3 text-sm text-gray-700">Loading matches...</p>
                    ) : matchError ? (
                        <p className="mt-3 text-sm font-semibold text-red-600">{matchError}</p>
                    ) : matches.length === 0 ? (
                        <p className="mt-3 text-sm text-gray-700">
                            No matches yet. Review applicants for your active jobs to start connecting.
                        </p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {matches.slice(0, 3).map((match) => (
                                <div
                                    key={match.match_id}
                                    className="rounded-lg border-2 border-black bg-white p-3"
                                >
                                    <p className="font-semibold">{match.job_title}</p>
                                    <p className="text-sm text-gray-700">
                                        Candidate #{match.seeker_id}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {match.candidate_name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    <Link
                        href="/pages/match/recruiter"
                        className="mt-4 inline-block rounded-md border-2 border-black bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-500"
                    >
                        View All Matches
                    </Link>
                </section>

                <section className="rounded-xl border-4 border-black bg-[#FFF8D8] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-xl font-bold">Quick Actions</h2>
                    <div className="mt-4 flex flex-col gap-3">
                        <Link
                            href="/pages/jobPost"
                            className="rounded-md border-2 border-black bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-500"
                        >
                            Post a Job
                        </Link>

                        <Link
                            href="/pages/swipe/recruiter"
                            className="rounded-md border-2 border-black bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-500"
                        >
                            Review Candidates
                        </Link>

                        <Link
                            href="/pages/match/recruiter"
                            className="rounded-md border-2 border-black bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-500"
                        >
                            View Matches
                        </Link>
                    </div>
                </section>

                <section className="rounded-xl border-4 border-black bg-[#FFF8D8] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-xl font-bold">Dashboard Summary</h2>
                    <div className="mt-4 space-y-2 text-sm text-gray-800">
                        <p>Total Jobs in View: {jobs.length}</p>
                        <p>Total Matches: {matches.length}</p>
                        <p>Current Filter: {jobScope === 'all' ? 'All Company Jobs' : jobScope === 'mine' ? 'My Jobs' : 'Others’ Jobs'}</p>
                    </div>
                </section>
            </div>
        </PageShell>
    );
}