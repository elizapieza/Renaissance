'use client';

import PageShell from '@/app/components/PageShell';
import Link from 'next/link';

export default function SignupRolePage() {
    return (
        <PageShell navBarVariant='loggedOut'>
            <div className='mb-8 text-center'>
                <h1 className='text-2xl font-bold tracking-tight text-black text-center'>Sign Up To Start Swiping Today! </h1>
            </div>
            
            <div className='flex flex-col items-center gap-6'>
                <p className='mb-0 text-md text-gray-700 text-center'> Welcome to Renaissance. </p>
                <p className='text-md text-gray-700 text-center'> Are you looking for a job opportunity, or are you a recruiter looking for a qualified candidate? </p>
                <div className='flex gap-4'>
                    <Link href='/pages/signup/seeker' className='px-4 py-2 bg-yellow-500 text-white text-center rounded-md hover:bg-yellow-600'>
                        Let me see the jobs
                    </Link>
                    <Link href='/pages/signup/recruiter' className='px-4 py-2 bg-yellow-500 text-white text-center rounded-md hover:bg-yellow-600'>
                        Let me see the canadites
                    </Link>
                </div>
            </div>
        </PageShell>
    );
}