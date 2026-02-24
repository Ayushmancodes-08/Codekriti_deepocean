/**
 * Force a file download in the browser by creating a temporary anchor element.
 * This bypasses React Router and internal SPA routing to ensure external 
 * static files are correctly served and downloaded, especially on 
 * platforms like Vercel.
 * 
 * @param url - The relative or absolute path to the file.
 * @param filename - The name to save the file as.
 */
export const triggerDownload = (url: string, filename: string): void => {
    try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        // This ensures the link isn't visible in the DOM
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);
    } catch (err) {
        console.error('Failed to trigger download:', err);
    }
};
