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
export const triggerDownload = async (url: string, filename: string): Promise<void> => {
    try {
        // 1. Fetch the file as a blob with no-cache to ensure we hit the real file
        const response = await fetch(url, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

        // Defensive check: If Vercel serves the HTML shell instead of the PDF
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
            throw new Error('Received HTML shell instead of PDF. Path mismatch or Vercel routing conflict.');
        }

        const blob = await response.blob();

        // 2. Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // 3. Create a temporary anchor and trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;

        // Ensure visibility requirements for some browsers
        link.style.display = 'none';
        document.body.appendChild(link);

        link.click();

        // 4. Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
        console.error('Download utility error:', err);
        // Fallback: direct window open if fetch or blob conversion fails
        const fallbackLink = document.createElement('a');
        fallbackLink.href = url;
        fallbackLink.target = '_blank';
        fallbackLink.rel = 'noopener noreferrer';
        fallbackLink.click();
    }
};
