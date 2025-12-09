import SparkMD5 from "spark-md5";

/**
 * Calculate SHA-256 hash of a file
 */
export const calculateSHA256 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

/**
 * Calculate SHA-1 hash of a file
 */
export const calculateSHA1 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-1", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

/**
 * Calculate MD5 hash of a file using SparkMD5
 * This processes the file in chunks to handle large files efficiently
 */
export const calculateMD5 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const chunkSize = 2097152; // 2MB chunks
        const chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();

        fileReader.onload = (e) => {
            if (e.target?.result) {
                spark.append(e.target.result as ArrayBuffer);
                currentChunk++;

                if (currentChunk < chunks) {
                    loadNext();
                } else {
                    resolve(spark.end());
                }
            }
        };

        fileReader.onerror = () => {
            reject(new Error("Failed to read file for MD5 calculation"));
        };

        function loadNext() {
            const start = currentChunk * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            fileReader.readAsArrayBuffer(file.slice(start, end));
        }

        loadNext();
    });
};

/**
 * Calculate checksum based on the selected algorithm
 */
export const calculateChecksum = async (
    file: File,
    algorithm: string
): Promise<string> => {
    switch (algorithm) {
        case "sha256":
            return await calculateSHA256(file);
        case "sha1":
            return await calculateSHA1(file);
        case "md5":
            return await calculateMD5(file);
        case "none":
            return "";
        default:
            throw new Error(`Unsupported checksum algorithm: ${algorithm}`);
    }
};

