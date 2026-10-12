import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Atomically writes content to a target file by first writing to a temporary file
 * in the same directory and renaming it. Automatically ensures parent directories exist.
 */
export async function writeAtomicJson(filePath: string, data: unknown): Promise<void> {
  if (!filePath || filePath.trim().length === 0) {
    throw new Error("Target file path cannot be empty");
  }
  const resolvedPath = path.resolve(filePath);
  const dir = path.dirname(resolvedPath);

  // Ensure directory exists
  await fs.mkdir(dir, { recursive: true });

  const jsonContent = JSON.stringify(data, null, "\t");
  const tempPath = path.join(dir, `.${path.basename(resolvedPath)}.${Date.now()}.${crypto.randomBytes(4).toString("hex")}.tmp`);

  try {
    await fs.writeFile(tempPath, jsonContent, "utf-8");
    await fs.rename(tempPath, resolvedPath);
  } catch (err) {
    try {
      await fs.unlink(tempPath);
    } catch {
      // Ignore cleanup error
    }
    throw err;
  }
}
