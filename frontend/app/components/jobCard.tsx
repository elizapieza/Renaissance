type JobCardContentProps = {
    title: string;
    industry: string;
    location: string;
    minPay: number;
    maxPay?: number | null;
    remote: boolean;
    educationLevel?: string;
    skills: string[];
    qualifications: string[];
    description: string;
};

export default function JobCardContent({
    title,
    industry,
    location,
    minPay,
    maxPay,
    remote,
    educationLevel,
    skills,
    qualifications,
    description,
}: JobCardContentProps) {
    return (
        <div className="flex flex-col h-full justify-between">
        <div className="space-y-5">
        <div>
            <p className="text-sm uppercase tracking-widest text-[#7A5C3E] font-semibold">
                Opportunity
            </p>
            <h2 className="text-3xl font-extrabold text-[#2B2118] leading-tight">
                {title}
            </h2>
            <p className="text-lg font-medium text-[#5A4632]">{industry}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm sm:text-base">
        <div className="bg-[#FFF4B8] rounded-2xl p-3 border border-[#D6BE77]">
            <p className="font-bold text-[#2B2118]">Location</p>
            <p className="text-[#4B3A2A]">{location}</p>
        </div>

        <div className="bg-[#FFF4B8] rounded-2xl p-3 border border-[#D6BE77]">
            <p className="font-bold text-[#2B2118]">Work Style</p>
            <p className="text-[#4B3A2A]">{remote ? "Remote" : "On-site"}</p>
        </div>

        <div className="bg-[#FFF4B8] rounded-2xl p-3 border border-[#D6BE77]">
            <p className="font-bold text-[#2B2118]">Pay</p>
            <p className="text-[#4B3A2A]">
                ${minPay.toLocaleString()}
                {maxPay ? ` - $${maxPay.toLocaleString()}` : "+"}
            </p>
        </div>

        <div className="bg-[#FFF4B8] rounded-2xl p-3 border border-[#D6BE77]">
            <p className="font-bold text-[#2B2118]">Education</p>
            <p className="text-[#4B3A2A]">{educationLevel || "Not listed"}</p>
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
            <h3 className="text-lg font-bold text-[#2B2118] mb-2">Qualifications</h3>
            <ul className="space-y-1 text-[#4B3A2A] text-sm sm:text-base">
                {qualifications.map((item, index) => (
                <li key={index}>• {item}</li>
                ))}
            </ul>
        </div>

        <div>
            <h3 className="text-lg font-bold text-[#2B2118] mb-2">Description</h3>
            <p className="text-[#4B3A2A] text-sm sm:text-base leading-relaxed line-clamp-5">
            {description}
            </p>
        </div>
        </div>
    </div>
    );
}