import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';


export const useAuth = () => {
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        const initializeUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                const { error } = await supabase.auth.signInAnonymously();
                if (error) console.error('Auto login failed:', error.message);
            }
            setIsAuthenticating(false)
        };
        initializeUser();
    }, []);
    return { isAuthenticating };
}
