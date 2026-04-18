"use client";

import PageShell from '@/app/components/PageShell';
import ProtectedRoute from '@/app/components/protectedRoutes';
import { auth } from '@/app/lib/firebase';
import { useEffect, useState } from 'react';

const educationOptions = [
    'High School',
    'Associate Degree',
    'Bachelor’s Degree',
    'Master’s Degree',
    'Doctorate',
    'Other',
];

const skillSuggestions = [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#',
    'HTML', 'CSS', 'React', 'Next.js', 'Vue', 'Angular', 'Tailwind CSS',
    'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase',
    'Git', 'GitHub', 'REST APIs', 'GraphQL', 'Docker',
    'AWS', 'Azure', 'Google Cloud', 'Linux', 'Bash',
    'Machine Learning', 'Data Analysis', 'Pandas', 'NumPy', 'PyTorch', 'TensorFlow',
    'UI Design', 'UX Design', 'Figma', 'Wireframing', 'Prototyping',
    'Testing', 'Debugging', 'Agile', 'Scrum', 'Project Management',
    'Communication', 'Teamwork', 'Leadership', 'Problem Solving', 'Critical Thinking',
    'Customer Service', 'Sales', 'Marketing', 'SEO', 'Content Writing',
    'Public Speaking', 'Teaching', 'Time Management', 'Adaptability', 'Organization'
];

export default function SeekerOnboardingPage() {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [education, setEducation] = useState('');
    const [experience, setExperience] = useState('');
    const [bio, setBio] = useState('');

    const [skillInput, setSkillInput] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [filteredSkills, setFilteredSkills] = useState<string[]>([]);

    useEffect(() => {
        localStorage.setItem('role', 'seeker');
        localStorage.setItem('profileComplete', 'false');
    }, []);

    const addSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (!trimmed) return;

        const alreadySelected = selectedSkills.some(
            (selected) => selected.toLowerCase() === trimmed.toLowerCase()
        );

        if (alreadySelected) {
            setSkillInput('');
            setFilteredSkills([]);
            return;
        }

        setSelectedSkills((prev) => [...prev, trimmed]);
        setSkillInput('');
        setFilteredSkills([]);
    };

    const removeSkill = (skillToRemove: string) => {
        setSelectedSkills((prev) =>
            prev.filter((skill) => skill !== skillToRemove)
        );
    };

    const handleSkillInputChange = (value: string) => {
        setSkillInput(value);

        if (!value.trim()) {
            setFilteredSkills([]);
            return;
        }

        const matches = skillSuggestions.filter(
            (skill) =>
                skill.toLowerCase().includes(value.toLowerCase()) &&
                !selectedSkills.some(
                    (selected) => selected.toLowerCase() === skill.toLowerCase()
                )
        );

        setFilteredSkills(matches.slice(0, 8));
    };

    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();

            if (filteredSkills.length > 0) {
                addSkill(filteredSkills[0]);
            } else {
                addSkill(skillInput);
            }
        }

        if (e.key === 'Backspace' && !skillInput && selectedSkills.length > 0) {
            removeSkill(selectedSkills[selectedSkills.length - 1]);
        }
    };

    const handleResumeUpload = async () => {
        setMessage('');
        setError('');

        if (!resumeFile) {
            setError('Please select a resume file to upload.');
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                setError('User not authenticated. Please log in again.');
                return;
            }

            const idToken = await user.getIdToken();

            const formData = new FormData();
            formData.append('resume', resumeFile);
            formData.append('idToken', idToken);

            const response = await fetch("http://127.0.0.1:8000/api/accounts/upload/resume/", {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Resume upload failed');
            }

            setMessage('Resume uploaded successfully!');
            console.log('Resume upload success:', data);
        } catch (error: any) {
            console.error('Resume upload error:', error.message);
            setError(error.message);
        }
    };

    const handleProfileSubmit = async () => {
        setMessage('');
        setError('');

        try {
            const user = auth.currentUser;
            if (!user) {
                setError('User not authenticated. Please log in again.');
                return;
            }

            const idToken = await user.getIdToken();

            const experienceArray = experience
                .split('\n')
                .map((exp) => exp.trim())
                .filter((exp) => exp.length > 0);

            const response = await fetch("http://127.0.0.1:8000/api/accounts/onboarding/seeker/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken,
                    firstName,
                    lastName,
                    phoneNumber,
                    bio,
                    education,
                    skills: selectedSkills,
                    experience: experienceArray,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Profile update failed');
            }

            localStorage.setItem('profileComplete', 'true');
            setMessage('Profile updated successfully!');
            console.log('Profile update success:', data);
        } catch (error: any) {
            console.error('Profile update error:', error.message);
            setError(error.message);
        }
    };

    return (
        <ProtectedRoute
            allowedRoles={['seeker']}
            redirectIfProfileComplete={true}
            redirectCompletedProfileTo="/pages/dashboard/seeker"
            redirectWrongRoleTo="/pages/dashboard"
        >
            <PageShell
                navBarVariant='seeker'
                layout='form'
                title='Complete Your Profile'
                description='Fill out your profile information to get the best matches and start swiping!'
            >
                <p className="mb-4 text-sm font-medium text-gray-700">
                    Step 3 of 3: Complete your seeker profile
                </p>

                <div className="relative z-20 flex flex-col items-center gap-4 text-center text-black">
                    <div className="w-full max-w-md">
                        <label className="mb-2 block text-sm font-semibold text-black">
                            Resume Upload
                        </label>

                        <label
                            htmlFor="resumeUpload"
                            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-black bg-white px-6 py-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:bg-yellow-50"
                        >
                            <span className="text-base font-semibold text-black">
                                {resumeFile ? 'Change selected resume' : 'Choose your resume file'}
                            </span>
                            <span className="mt-1 text-sm text-gray-700">
                                DOCX only
                            </span>

                            {resumeFile && (
                                <span className="mt-3 rounded-md bg-yellow-100 px-2 py-1 text-sm font-medium text-black">
                                    Selected: {resumeFile.name}
                                </span>
                            )}
                        </label>

                        <input
                            id="resumeUpload"
                            type="file"
                            accept=".docx"
                            onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                            className="hidden"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleResumeUpload}
                        className="rounded-md border-2 border-black bg-[#E6B819] px-5 py-3 font-semibold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#d4a915]"
                    >
                        Upload Resume
                    </button>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black">First Name</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="border-2 border-black bg-white p-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black">Last Name</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="border-2 border-black bg-white p-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                    </div>

                    <label className="text-sm font-semibold text-black">Phone Number</label>
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="border-2 border-black bg-white text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />

                    <label className="text-sm font-semibold text-black">Short Bio</label>
                    <textarea
                        placeholder="Short Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="border-2 border-black bg-white text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        rows={4}
                    />

                    <label className="text-sm font-semibold text-black">Education Level</label>
                    <select
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="border-2 border-black bg-white text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <option value="">Select education level</option>
                        {educationOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <div className="relative flex flex-col gap-2">
                        <label className="text-sm font-semibold text-black">Skills</label>

                        <div className="rounded-lg border-2 border-black bg-white p-3 focus-within:ring-2 focus-within:ring-yellow-500">
                            <div className="flex flex-wrap gap-2">
                                {selectedSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="flex items-center gap-2 rounded-full border-2 border-black bg-yellow-200 px-3 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="font-bold text-black hover:text-red-600"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}

                                <input
                                    type="text"
                                    placeholder="Type a skill and press Enter"
                                    value={skillInput}
                                    onChange={(e) => handleSkillInputChange(e.target.value)}
                                    onKeyDown={handleSkillKeyDown}
                                    className="min-w-[180px] flex-1 bg-transparent p-1 text-black outline-none"
                                />
                            </div>
                        </div>

                        {filteredSkills.length > 0 && (
                            <div className="absolute top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                {filteredSkills.map((skill) => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => addSkill(skill)}
                                        className="block w-full border-b border-gray-200 px-4 py-2 text-left text-sm text-black hover:bg-yellow-100 last:border-b-0"
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        )}

                        <p className="text-sm text-gray-700">
                            Start typing to see suggestions. Press Enter to add a skill.
                        </p>
                    </div>

                    <label className="text-sm font-semibold text-black">Experience</label>
                    <textarea
                        placeholder="Experience (one item per line)"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="border-2 border-black bg-white text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        rows={5}
                    />

                    <button
                        type="button"
                        onClick={handleProfileSubmit}
                        className="rounded-md border-2 border-black bg-green-600 px-4 py-2 font-semibold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-700"
                    >
                        Save Profile
                    </button>

                    {message && <p className='text-green-600'>{message}</p>}
                    {error && <p className='text-red-600'>{error}</p>}
                </div>
            </PageShell>
        </ProtectedRoute>
    );
}