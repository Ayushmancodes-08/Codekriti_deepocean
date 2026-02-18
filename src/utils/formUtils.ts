
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
        e.key !== '+' &&
        !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)
    ) {
        e.preventDefault();
    }
};

/**
 * Enforces strict phone number formatting during input.
 * - Allows digits and '+'.
 * - If starts with '+91', max length is 13 (+91 + 10 digits).
 * - Else (if no '+'), max length is 10 digits.
 * @param value - The raw input value.
 * @returns The formatted value.
 */
export const formatStrictPhone = (value: string): string => {
    // 1. Remove anything that isn't a digit or '+'
    let cleaned = value.replace(/[^\d+]/g, '');

    // 2. Handle '+' placement
    if (cleaned.includes('+')) {
        if (!cleaned.startsWith('+')) {
            cleaned = cleaned.replace(/\+/g, '');
        } else {
            cleaned = '+' + cleaned.slice(1).replace(/\+/g, '');
        }
    }

    // 3. Auto-formatting Logic
    if (cleaned.startsWith('+91')) {
        // Limit to 13 chars (raw: +91 + 10 digits)
        const raw = cleaned.slice(0, 13);

        // Format as: +91 XXXXX XXXXX
        // +91 (3 chars)
        if (raw.length > 3) {
            const part1 = raw.slice(0, 3); // +91
            const remaining = raw.slice(3);

            if (remaining.length > 5) {
                return `${part1} ${remaining.slice(0, 5)} ${remaining.slice(5)}`;
            } else {
                return `${part1} ${remaining}`;
            }
        }
        return raw;
    }

    // Standard 10 digits case
    // Format as: XXXXX XXXXX
    const raw = cleaned.slice(0, 10);
    if (raw.length > 5) {
        return `${raw.slice(0, 5)} ${raw.slice(5)}`;
    }

    return raw;
};
