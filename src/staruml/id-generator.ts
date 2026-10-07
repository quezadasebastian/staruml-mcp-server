import crypto from "node:crypto";

/**
 * StarUML uses 24-character Base64-like alphanumeric IDs (e.g. `AAAAAAF...=` or `AAAAAAG...=`).
 * This utility generates unique, collision-free StarUML-compatible IDs and provides
 * an ID mapping registry to map human-readable or user-provided IDs to valid StarUML IDs.
 */

// Track allocated IDs within the current runtime session to guarantee uniqueness
const allocatedIds = new Set<string>();

/**
 * Validates whether a given string adheres to StarUML's 24-character Base64-style ID format.
 */
export function isValidStarUMLId(id: string): boolean {
  return typeof id === "string" && id.length === 24 && /^[A-Za-z0-9+/]+=*$/.test(id);
}

/**
 * Generates a unique 24-character StarUML-compatible ID.
 * Standard format uses 16 random bytes encoded as Base64, with standard 'AAAAAAG' prefix
 * or random bytes padded to exactly 24 characters.
 */
export function generateStarUMLId(prefix = "AAAAAAG"): string {
  while (true) {
    // Generate 12 random bytes (16 base64 chars)
    const randomPart = crypto.randomBytes(12).toString("base64");
    // Ensure prefix is 7 chars, random is 16 chars, end with '=' -> 24 chars
    const candidate = `${prefix}${randomPart.slice(0, 16)}=`;
    if (candidate.length === 24 && !allocatedIds.has(candidate)) {
      allocatedIds.add(candidate);
      return candidate;
    }
  }
}

/**
 * ID Registry to map arbitrary input IDs (e.g., "User", "OrderService", "c1")
 * to persistent, valid 24-char StarUML IDs within the scope of a diagram generation.
 */
export class IdRegistry {
  private readonly mapping = new Map<string, string>();
  private readonly reverseMapping = new Map<string, string>();

  /**
   * Resolves or generates a StarUML ID for a given user-specified key/alias.
   * If the input is already a valid 24-char StarUML ID not yet claimed by another key,
   * it is preserved.
   */
  public resolve(key: string): string {
    if (this.mapping.has(key)) {
      return this.mapping.get(key)!;
    }

    let starUmlId: string;
    if (isValidStarUMLId(key) && !this.reverseMapping.has(key)) {
      starUmlId = key;
      allocatedIds.add(starUmlId);
    } else {
      starUmlId = generateStarUMLId();
    }

    this.mapping.set(key, starUmlId);
    this.reverseMapping.set(starUmlId, key);
    return starUmlId;
  }

  /**
   * Directly registers a specific key with a target StarUML ID.
   */
  public register(key: string, starUmlId: string): void {
    this.mapping.set(key, starUmlId);
    this.reverseMapping.set(starUmlId, key);
    allocatedIds.add(starUmlId);
  }

  /**
   * Returns the mapped StarUML ID if it exists, otherwise undefined.
   */
  public get(key: string): string | undefined {
    return this.mapping.get(key);
  }

  /**
   * Returns the original input key for a given StarUML ID, if mapped.
   */
  public getOriginalKey(starUmlId: string): string | undefined {
    return this.reverseMapping.get(starUmlId);
  }
}
