'use client';

import PageShell from '@/app/components/PageShell';
import { auth } from '@/app/lib/firebase';
import { useState } from 'react';

const educationOptions = [
    'High School',
    'Associate Degree',
    'Bachelor’s Degree',
    'Master’s Degree',
    'Doctorate',
    'Other',
];

export default function PostAJobPage() {
    const [title, setTitle] = useState('');
    const [industry, setIndustry] = useState('');
    const [location, setLocation] = useState('');
    const [requiredEducation, setRequiredEducation] = useState('');
    const [minPay, setMinPay] = useState('');
    const [maxPay, setMaxPay] = useState('');
    const [description, setDescription] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [requirements, setRequirements] = useState('');
    const [remote, setRemote] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleCreateJob = async () => {
        setError('');
        setMessage('');
        setSubmitting(true);

        try {
            const user = auth.currentUser;

            if (!user) {
                setError('User not authenticated. Please log in again.');
                return;
            }

            const idToken = await user.getIdToken();

            const response = await fetch('http://127.0.0.1:8000/api/jobs/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken,
                    title,
                    industry,
                    location,
                    requiredEducation,
                    minPay: parseInt(minPay, 10),
                    maxPay: maxPay ? parseInt(maxPay, 10) : null,
                    description,
                    qualifications: qualifications
                        .split(',')
                        .map((item) => item.trim())
                        .filter((item) => item !== ''),
                    requirements: requirements
                        .split(',')
                        .map((item) => item.trim())
                        .filter((item) => item !== ''),
                    remote,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create job.');
            }

            setMessage('Job created successfully!');

            setTitle('');
            setIndustry('');
            setLocation('');
            setRequiredEducation('');
            setMinPay('');
            setMaxPay('');
            setDescription('');
            setQualifications('');
            setRequirements('');
            setRemote(false);
        } catch (error: any) {
            console.error('Create job error:', error.message);
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageShell
            navBarVariant="recruiter"
            layout="form"
            title="Post a Job"
            description="Create a job listing so candidates in your company network can be ranked and reviewed."
        >
            <div className="mx-auto max-w-2xl text-black">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateJob();
                    }}
                    className="space-y-5"
                >
                    <div>
                        <label htmlFor="title" className="mb-1 block font-semibold">
                            Job Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="industry" className="mb-1 block font-semibold">
                            Industry
                        </label>
                        <input
                            id="industry"
                            type="text"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="mb-1 block font-semibold">
                            Location
                        </label>
                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="requiredEducation" className="mb-1 block font-semibold">
                            Required Education
                        </label>
                        <select
                            id="requiredEducation"
                            value={requiredEducation}
                            onChange={(e) => setRequiredEducation(e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white p-2"
                        >
                            <option value="">Select education level</option>
                            {educationOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor="minPay" className="mb-1 block font-semibold">
                                Minimum Pay
                            </label>
                            <input
                                id="minPay"
                                type="number"
                                value={minPay}
                                onChange={(e) => setMinPay(e.target.value)}
                                className="w-full rounded border border-gray-300 bg-white p-2"
                            />
                        </div>

                        <div>
                            <label htmlFor="maxPay" className="mb-1 block font-semibold">
                                Maximum Pay
                            </label>
                            <input
                                id="maxPay"
                                type="number"
                                value={maxPay}
                                onChange={(e) => setMaxPay(e.target.value)}
                                className="w-full rounded border border-gray-300 bg-white p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="mb-1 block font-semibold">
                            Job Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white p-2"
                            rows={5}
                        />
                    </div>

                    <div>
                        <label htmlFor="qualifications" className="mb-1 block font-semibold">
                            Qualifications (comma separated)
                        </label>
                        <input
                            id="qualifications"
                            type="text"
                            value={qualifications}
                            onChange={(e) => setQualifications(e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="requirements" className="mb-1 block font-semibold">
                            Requirements / Skills (comma separated)
                        </label>
                        <input
                            id="requirements"
                            type="text"
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white p-2"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            id="remote"
                            type="checkbox"
                            checked={remote}
                            onChange={(e) => setRemote(e.target.checked)}
                            className="h-4 w-4"
                        />
                        <label htmlFor="remote" className="font-semibold">
                            Remote job
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded bg-yellow-500 p-2 font-semibold text-white hover:bg-yellow-600 disabled:opacity-60"
                    >
                        {submitting ? 'Creating Job...' : 'Create Job'}
                    </button>

                    {message && <p className="text-green-600">{message}</p>}
                    {error && <p className="text-red-600">{error}</p>}
                </form>
            </div>
        </PageShell>
    );
}