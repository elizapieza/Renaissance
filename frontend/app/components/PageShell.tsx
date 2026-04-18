import AccessibilityMenu from './accessibilityMenu';
import Nav from './navbar';

type PageShellProps = {
    children: React.ReactNode;
    navBarVariant?: 'loggedOut' | 'recruiter' | 'seeker';
    layout?: 'auth' | 'form' | 'board' | 'immersive' | 'legal';
    title?: string;
    description?: string;
};

export default function PageShell({
    children,
    navBarVariant = 'loggedOut',
    layout = 'auth',
    title,
    description,
}: PageShellProps) {

    const isAuth = layout === 'auth';
    const isForm = layout === 'form';
    const isBoard = layout === 'board';
    const isImmersive = layout === 'immersive';
    const isLegal = layout === 'legal';

    const containerWidth =
        isAuth
            ? 'max-w-2xl'
            : isForm
            ? 'max-w-4xl'
            : isBoard
            ? 'max-w-7xl'
            : isImmersive
            ? 'max-w-6xl'
            : 'max-w-4xl';

    const useCardContainer = !isBoard && !isImmersive;

    const backgroundClass = isLegal ? 'bg-[#FAF7EF]' : 'bg-[#FFFBEB]';

    const headingAlignment = isAuth || isForm ? 'text-center' : 'text-left';
    const descriptionWidth = isAuth || isForm ? 'max-w-2xl mx-auto' : 'max-w-3xl';
    const cardTopSpacing = isAuth ? 'mt-8' : 'mt-4';

    return (
        <main className="min-h-screen bg-[#FFF8DC] text-black">
            <header>
                <Nav variant={navBarVariant} />
            </header>

            <AccessibilityMenu />

            <section
                className={`relative min-h-[calc(100vh-80px)] ${backgroundClass} px-4 py-8 md:px-8 md:py-10`}
            >
                {!isLegal && (
                    <div className="pointer-events-none absolute inset-0">
                        <div
                            className="absolute inset-0 opacity-95"
                            style={{
                                background: `
                                    linear-gradient(180deg, #E5B928 0%, #D9AF2A 100%)
                                `,
                            }}
                        />

                        <div
                            className="absolute inset-0"
                            style={{
                                background: `
                                    radial-gradient(circle at center, rgba(255, 245, 225, 0.95) 0%, rgba(255, 245, 225, 0.88) 22%, rgba(255, 245, 225, 0.45) 42%, rgba(255, 245, 225, 0) 68%)
                                `,
                            }}
                        />

                        <div
                            className="absolute inset-0 opacity-35"
                            style={{
                                background: `
                                    repeating-linear-gradient(
                                        100deg,
                                        rgba(255, 248, 190, 0.22) 0px,
                                        rgba(255, 248, 190, 0.22) 80px,
                                        rgba(255, 255, 255, 0) 80px,
                                        rgba(255, 255, 255, 0) 170px
                                    )
                                `,
                            }}
                        />
                    </div>
                )}

                <div className="relative z-10 mx-auto w-full">
                    <div className={`mx-auto w-full ${containerWidth}`}>
                        {isBoard ? (
                            <div>
                                {(title || description) && (
                                    <div className={`mb-6 ${headingAlignment}`}>
                                        {title && (
                                            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                                                {title}
                                            </h1>
                                        )}
                                        {description && (
                                            <p className={`mt-3 ${descriptionWidth} text-base leading-7 text-gray-800`}>
                                                {description}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div id="main-content">{children}</div>
                            </div>
                        ) : useCardContainer ? (
                            <div
                                id="main-content"
                                className={[
                                    'rounded-xl border-4 border-black bg-[#FFF8D8] p-6 md:p-8',
                                    'shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]',
                                    cardTopSpacing,
                                ].join(' ')}
                            >
                                {(title || description) && (
                                    <div className={`mb-6 ${headingAlignment}`}>
                                        {title && (
                                            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                                                {title}
                                            </h1>
                                        )}
                                        {description && (
                                            <p className={`mt-3 ${descriptionWidth} text-base leading-7 text-gray-800`}>
                                                {description}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {children}
                            </div>
                        ) : (
                            <div id="main-content" className="py-6">
                                {(title || description) && (
                                    <div className="mb-6 rounded-xl border-4 border-black bg-[#FFF8D8] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                        <div className={headingAlignment}>
                                            {title && (
                                                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                                                    {title}
                                                </h1>
                                            )}
                                            {description && (
                                                <p className={`mt-3 ${descriptionWidth} text-base leading-7 text-gray-800`}>
                                                    {description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {children}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}