import { useEffect } from 'react';
import { useRegistration } from '../contexts/RegistrationContext';

export function EventSelector() {
    const { selectEvent, formState } = useRegistration();

    // Auto-select algo-to-code event when component mounts
    useEffect(() => {
        if (!formState.selectedEvent) {
            selectEvent('algo-to-code');
        }
    }, []);

    return null;
}
