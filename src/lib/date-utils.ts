/**
 * Safely formats a date string for display
 * @param dateString The date string to format
 * @returns A formatted date string
 */
export function formatDateString(dateString: string | Date | undefined | null): string {
    try {
        if (!dateString) return "No date";

        // Handle the specific format from the backend that causes issues
        // Example: "2025-03-01 18:30:00.0 +00:00:00"
        if (typeof dateString === 'string') {
            // Log the input for debugging
            console.debug("Formatting date string:", dateString);

            // First try to handle the specific format with '+' character
            if (dateString.includes('+')) {
                // Extract just the date part before any timezone or additional info
                const cleanedDate = dateString.split('+')[0].trim();
                const date = new Date(cleanedDate);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString();
                }
            }

            // Try to parse it as a regular date string
            const normalDate = new Date(dateString);
            if (!isNaN(normalDate.getTime())) {
                return normalDate.toLocaleDateString();
            }

            // If still failing, attempt to extract just the YYYY-MM-DD part
            const dateMatch = dateString.match(/\d{4}-\d{2}-\d{2}/);
            if (dateMatch) {
                return new Date(dateMatch[0]).toLocaleDateString();
            }

            // If all parsing attempts fail
            console.error("Failed to parse date string:", dateString);
            return "Invalid date";
        }

        // If it's already a Date object
        if (!isNaN(dateString.getTime())) {
            return dateString.toLocaleDateString();
        }

        return "Invalid date";
    } catch (error) {
        console.error("Error formatting date:", error, "Input was:", dateString);
        return "Invalid date";
    }
}

/**
 * Parses a date string from the backend into a valid Date object
 * @param dateString The date string from the backend
 * @returns A valid Date object or null if parsing fails
 */
export function parseDateString(dateString: string | Date | undefined): Date | null {
    try {
        if (!dateString) return null;

        // If it's already a Date object, return it
        if (dateString instanceof Date) return dateString;

        // Handle the specific format from the backend that causes issues
        // Example: "2025-03-01 18:30:00.0 +00:00:00"
        const cleanedDate = dateString.split('+')[0].trim();
        const parsedDate = new Date(cleanedDate);

        // Check if the date is valid
        if (isNaN(parsedDate.getTime())) return null;

        return parsedDate;
    } catch (error) {
        console.error("Error parsing date:", error, "Input was:", dateString);
        return null;
    }
}

/**
 * Validates that start date and end date are valid and logically correct
 * @param startDate The start date to validate
 * @param endDate The end date to validate
 * @returns Error message or null if valid
 */
export function validateDates(startDate?: Date, endDate?: Date): string | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!startDate || !endDate) {
        return "Please select both start and end dates";
    }

    // Make copies to avoid modifying original dates
    const startDateCopy = new Date(startDate);
    const endDateCopy = new Date(endDate);

    // Reset time portion to compare dates only
    startDateCopy.setHours(0, 0, 0, 0);
    endDateCopy.setHours(0, 0, 0, 0);

    if (startDateCopy < today) {
        return "Start date cannot be before today";
    }

    if (endDateCopy < today) {
        return "End date cannot be before today";
    }

    if (endDateCopy < startDateCopy) {
        return "End date cannot be before start date";
    }

    return null;
}
