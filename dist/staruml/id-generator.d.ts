/**
 * Validates whether a given string adheres to StarUML's 24-character Base64-style ID format.
 */
export declare function isValidStarUMLId(id: string): boolean;
/**
 * Generates a unique 24-character StarUML-compatible ID.
 * Standard format uses 16 random bytes encoded as Base64, with standard 'AAAAAAG' prefix
 * or random bytes padded to exactly 24 characters.
 */
export declare function generateStarUMLId(prefix?: string): string;
/**
 * ID Registry to map arbitrary input IDs (e.g., "User", "OrderService", "c1")
 * to persistent, valid 24-char StarUML IDs within the scope of a diagram generation.
 */
export declare class IdRegistry {
    private readonly mapping;
    private readonly reverseMapping;
    /**
     * Resolves or generates a StarUML ID for a given user-specified key/alias.
     * If the input is already a valid 24-char StarUML ID not yet claimed by another key,
     * it is preserved.
     */
    resolve(key: string): string;
    /**
     * Directly registers a specific key with a target StarUML ID.
     */
    register(key: string, starUmlId: string): void;
    /**
     * Returns the mapped StarUML ID if it exists, otherwise undefined.
     */
    get(key: string): string | undefined;
    /**
     * Returns the original input key for a given StarUML ID, if mapped.
     */
    getOriginalKey(starUmlId: string): string | undefined;
}
