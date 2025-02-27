import { useState, useEffect } from 'react';
import { ApiResponse, Poll } from "@/types/poll";
import axiosInstance from "@/lib/axios";

export function usePolls(endpoint: string = "/api/polls") {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get<ApiResponse<Poll[]>>(endpoint);
                setPolls(response.data.data || []);
                setError(null);
            } catch (err) {
                setError("Failed to load polls");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPolls();
    }, [endpoint]);

    return { polls, loading, error };
}
