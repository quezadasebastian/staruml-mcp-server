/**
 * Atomically writes content to a target file by first writing to a temporary file
 * in the same directory and renaming it. Automatically ensures parent directories exist.
 */
export declare function writeAtomicJson(filePath: string, data: unknown): Promise<void>;
