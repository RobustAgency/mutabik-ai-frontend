import { useState, useCallback } from 'react';
import { frameworkService, type Framework } from '@/service/app/frameworks';
import { toast } from 'react-toastify';

export const useFrameworks = () => {
    const [frameworks, setFrameworks] = useState<Framework[]>([]);
    const [currentFramework, setCurrentFramework] = useState<Framework | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFrameworks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await frameworkService.getFrameworks();

            if (!response.error) {
                setFrameworks(response.data.data);
            } else {
                setError(response.message || 'Failed to fetch frameworks');
                toast.error(response.message || 'Failed to fetch frameworks');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch frameworks';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFramework = useCallback(async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await frameworkService.getFramework(id);

            if (!response.error) {
                setCurrentFramework(response.data);
                return response.data;
            } else {
                setError(response.message || 'Failed to fetch framework');
                toast.error(response.message || 'Failed to fetch framework');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch framework';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        frameworks,
        currentFramework,
        loading,
        error,
        fetchFrameworks,
        fetchFramework,
    };
};