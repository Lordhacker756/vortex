import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/login');
        }
    }, [router]);

    return { isAuthenticated: !!localStorage.getItem('userId') };
};
