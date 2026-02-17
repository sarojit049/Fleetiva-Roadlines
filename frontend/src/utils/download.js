import api from "../api/axios";

/**
 * Utility to download a file from the API using Bearer authentication.
 * Fetches the file as a blob and triggers a programmatic download.
 * @param {string} url - The API endpoint URL
 * @param {string} defaultFilename - Fallback filename if content-disposition is missing
 */
export const downloadFile = async (url, defaultFilename) => {
    try {
        const response = await api.get(url, {
            responseType: "blob",
        });

        // Extract filename from content-disposition if available
        let filename = defaultFilename;
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
            if (filenameMatch?.[1]) {
                filename = filenameMatch[1];
            }
        }

        // Create a temporary link and trigger download
        const blob = new Blob([response.data], { type: response.headers["content-type"] });
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Download failed:", error);
        throw error;
    }
};
