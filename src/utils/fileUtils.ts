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

        // Use visibility: hidden and position: absolute to ensure the link 
        // is technically "visible" and "present" in the layout, which 
        // some browsers (like Safari/Firefox) require for programmatic clicks.
        link.style.visibility = 'hidden';
        link.style.position = 'absolute';
        link.style.width = '0px';
        link.style.height = '0px';

        document.body.appendChild(link);
        link.click();

        // Give the browser a moment to register the click before removing
        setTimeout(() => {
            if (link.parentNode) {
                document.body.removeChild(link);
            }
        }, 150);
    } catch (err) {
        console.error('Failed to trigger download:', err);
    }
};
