
/**
 * Capitalizes the first letter of each word in a string.
 * @param value - The string to capitalize.
 * @returns The capitalized string.
 */
export const capitalizeName = (value: string): string => {
    if (!value) return '';
    return value
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Formats a phone number string into +91 XXXXX XXXXX format.
 * Expects a 10 digit number.
 * @param value - The raw phone number string.
 * @returns The formatted phone number.
 */
export const formatPhoneNumber = (value: string): string => {
    if (!value) return '';

    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');

    // If it starts with 91 and is longer than 10 digits, remove the 91 prefix for normalization
    let coreNumber = cleaned;
    if (cleaned.startsWith('91') && cleaned.length > 10) {
        coreNumber = cleaned.slice(2);
    }

    // Limit to 10 digits
    const truncated = coreNumber.slice(0, 10);

    if (truncated.length === 0) return '';

    // Format as +91 XXXXX XXXXX
    if (truncated.length <= 5) {
        return `+91 ${truncated}`;
    } else {
        return `+91 ${truncated.slice(0, 5)} ${truncated.slice(5)}`;
    }
};

/**
 * Prevents non-numeric input in number fields.
 * @param e - The keyboard event.
 */
export const preventNonNumeric = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
        !/[0-9]/.test(e.key) &&
        e.key !== 'Backspace' &&
        e.key !== 'Delete' &&
        e.key !== 'Tab' &&
        e.key !== 'ArrowLeft' &&
        e.key !== 'ArrowRight'
    ) {
        e.preventDefault();
    }
};
