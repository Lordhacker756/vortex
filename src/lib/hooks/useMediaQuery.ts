'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        // Update the state with the current value
        setMatches(media.matches);

        // Create a listener function
        const listener = () => setMatches(media.matches);

        // Register the listener for changes
        media.addEventListener('change', listener);

        // Clean up the listener when the component unmounts
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
}
