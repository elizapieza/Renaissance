type SwipeCardProps = {
    children: React.ReactNode;
};

export default function SwipeCard({ children }: SwipeCardProps) {
    return (
    <div className="w-full max-w-xl min-h-[560px] bg-[#FFFBDB] border-4 border-[#3B2F2F] rounded-3xl shadow-[8px_8px_0px_#3B2F2F] p-6 sm:p-8 flex flex-col justify-between">
        {children}
    </div>
    );
}