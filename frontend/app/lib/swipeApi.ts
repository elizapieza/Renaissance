import { auth } from '@/app/lib/firebase';

type RankedJob = {
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

type MatchItem = {
    match_id: number;
    job_id: number;
    job_title: string;
    company_name?: string;
    location?: string;
    seeker_id?: number;
    candidate_name?: string;
    created_at: string;
};

async function getIdTokenOrThrow() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('User not authenticated.');
    }

    return await user.getIdToken();
}

export async function fetchRankedJobs(): Promise<RankedJob[]> {
    const idToken = await getIdTokenOrThrow();

    const response = await fetch('http://127.0.0.1:8000/api/jobs/rankedJobs/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch ranked jobs.');
    }

    return data.jobs || [];
}

export async function submitJobSwipe(jobId: number, action: 'yes' | 'no' | 'save') {
    const idToken = await getIdTokenOrThrow();

    const response = await fetch('http://127.0.0.1:8000/api/swipe/submit-job-swipe/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idToken,
            jobId,
            action,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to save job swipe.');
    }

    return data;
}

export async function fetchRecruiterJobs(scope: 'all' | 'mine' | 'others' = 'all') {
    const idToken = await getIdTokenOrThrow();

    const response = await fetch('http://127.0.0.1:8000/api/swipe/recruiter/jobs/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idToken,
            scope,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recruiter jobs.');
    }

    return data.jobs || [];
}

export async function fetchRankedApplicants(jobId: number): Promise<RankedApplicant[]> {
    const idToken = await getIdTokenOrThrow();

    const response = await fetch('http://127.0.0.1:8000/api/swipe/ranked-applicants/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idToken,
            jobId,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch ranked applicants.');
    }

    return data.applicants || [];
}

export async function submitCandidateSwipe(
    seekerId: number,
    jobId: number,
    action: 'yes' | 'no' | 'save'
) {
    const idToken = await getIdTokenOrThrow();

    const response = await fetch('http://127.0.0.1:8000/api/swipe/submit-candidate-swipe/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idToken,
            seekerId,
            jobId,
            action,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to save candidate swipe.');
    }

    return data;
}

export async function fetchMatches(): Promise<MatchItem[]> {
    const idToken = await getIdTokenOrThrow();

    const response = await fetch('http://127.0.0.1:8000/api/swipe/matches/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch matches.');
    }

    return data.matches || [];
}