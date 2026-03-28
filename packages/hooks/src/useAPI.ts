import { useMemo } from 'react';
import { createClient } from '@focusflow/api';
import { useAuthStore } from '@focusflow/stores';

export const useAPI = () => {
    const client = useMemo(() => {
        return createClient(() => useAuthStore.getState().access_token);
    }, []);

    return client;
};
