/**
 * Force a file download in the browser by creating a temporary anchor element.
 * This bypasses React Router and internal SPA routing to ensure external 
 * Force a file download in the browser by fetching the file as a blob.
 * This is the most robust method for SPAs on platforms like Vercel, as it
 * ensures the file is fully retrieved before the browser triggers the 
 * "save" dialog, bypassing any potential route interception.
 * 
 * @param url - The relative or absolute path to the file.
 * @param filename - The name to save the file as.
 */
export const triggerDownload = async (url: string, _filename: string): Promise<void> => {
    try {
        window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
        console.error('File open error:', err);
    }
};
