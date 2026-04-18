'use client';

import { auth } from '@/app/lib/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';

type NavbarProps = {
    variant?: 'loggedOut' | 'recruiter' | 'seeker';
};

export default function Nav({ variant = 'loggedOut' }: NavbarProps) {
    const links =
        variant === 'loggedOut'
            ? [
                  { href: '/pages/login', label: 'Login' },
                  { href: '/pages/signup', label: 'Signup' },
              ]
            : variant === 'seeker'
              ? [
                    { href: '/pages/swipe', label: 'Swipe' },
                    { href: '/pages/match', label: 'Match' },
                    { href: '/pages/dashboard', label: 'Connect' },
                ]
              : variant === 'recruiter'
                ? [
                      { href: '/pages/swipe', label: 'Swipe' },
                      { href: '/pages/match', label: 'Match' },
                      { href: '/pages/dashboard', label: 'Connect' },
                  ]
                : [];

    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('role');
            localStorage.removeItem('profileComplete');
            router.push('/pages/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-[#FFF8D8]">
            <div className="mx-auto w-full px-4 py-3 text-black">
                <div className="grid grid-cols-3 items-center">
                    <div className="justify-self-start">
                        <div className="text-lg font-bold whitespace-nowrap">Renaissance</div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        {links.map((l) => {
                            const active = pathname === l.href;

                            return (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className={[
                                        'rounded-full px-3 py-1 text-lg font-semibold whitespace-nowrap',
                                        active ? 'underline underline-offset-4' : '',
                                    ].join(' ')}
                                >
                                    {l.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="justify-self-end">
                        {variant !== 'loggedOut' && (
                            <div className="flex flex-col items-center gap-1 text-center">
                                <Link href="/pages/dashboard">
                                    <FaUserCircle size={28} />
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-semibold text-black hover:text-red-700"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}