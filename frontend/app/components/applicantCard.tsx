type ExperienceItem = {
    title: string;
    length: string;
};

type ApplicantCardContentProps = {
    applicantId: string;
    desiredTitle: string;
    location: string;
    educationLevel: string;
    skills: string[];
    certifications: string[];
    experience: ExperienceItem[];
    bio: string;
};

export default function ApplicantCardContent({
    applicantId,
    desiredTitle,
    location,
    educationLevel,
    skills,
    certifications,
    experience,
    bio,
}: ApplicantCardContentProps) {
    return (
    <div className="flex flex-col h-full justify-between">
        <div className="space-y-5">
        <div>
            <p className="text-sm uppercase tracking-widest text-[#7A5C3E] font-semibold">
            Candidate
            </p>
            <h2 className="text-3xl font-extrabold text-[#2B2118] leading-tight">
            {applicantId}
            </h2>
            <p className="text-lg font-medium text-[#5A4632]">{desiredTitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm sm:text-base">
            <div className="bg-[#FFF4B8] rounded-2xl p-3 border border-[#D6BE77]">
            <p className="font-bold text-[#2B2118]">Location</p>
            <p className="text-[#4B3A2A]">{location}</p>
            </div>

            <div className="bg-[#FFF4B8] rounded-2xl p-3 border border-[#D6BE77]">
            <p className="font-bold text-[#2B2118]">Education</p>
            <p className="text-[#4B3A2A]">{educationLevel}</p>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-bold text-[#2B2118] mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
                <span
                key={index}
                className="bg-[#F7D774] text-[#2B2118] px-3 py-1 rounded-full text-sm font-medium border border-[#C8A84F]"
                >
                {skill}
                </span>
            ))}
            </div>
        </div>

        <div>
            <h3 className="text-lg font-bold text-[#2B2118] mb-2">Certifications</h3>
            <div className="flex flex-wrap gap-2">
            {certifications.length > 0 ? (
                certifications.map((cert, index) => (
                <span
                    key={index}
                    className="bg-[#EADFB7] text-[#2B2118] px-3 py-1 rounded-full text-sm font-medium border border-[#BCA76B]"
                >
                    {cert}
                </span>
                ))
            ) : (
                <p className="text-[#4B3A2A]">None listed</p>
            )}
            </div>
        </div>

        <div>
            <h3 className="text-lg font-bold text-[#2B2118] mb-2">Experience</h3>
            <ul className="space-y-1 text-[#4B3A2A] text-sm sm:text-base">
            {experience.map((item, index) => (
                <li key={index}>
                • {item.title} ({item.length})
                </li>
            ))}
            </ul>
        </div>

        <div>
            <h3 className="text-lg font-bold text-[#2B2118] mb-2">About</h3>
            <p className="text-[#4B3A2A] text-sm sm:text-base leading-relaxed line-clamp-5">
            {bio}
            </p>
        </div>
        </div>
    </div>
    );
}