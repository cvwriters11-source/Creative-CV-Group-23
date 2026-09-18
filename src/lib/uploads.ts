import { promises as fs } from "node:fs";
import path from "node:path";

const maxBytes = 8 * 1024 * 1024;

export type OrderUploadKind = "photo" | "cv" | "extra" | "delivery";

export function safeUploadName(name: string) {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 80) || "file";
}

export function isImageFile(file: File) {
  return (
    ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type) ||
    /\.(jpe?g|png|webp)$/i.test(file.name)
  );
}

export function isCvFile(file: File) {
  return (
    [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(file.type) || /\.(pdf|docx?)$/i.test(file.name)
  );
}

export async function saveOrderUpload(folder: string, prefix: string, file: File | null) {
  if (!file || file.size === 0) return "";
  if (file.size > maxBytes) {
    throw new Error(`${file.name} is larger than 8MB.`);
  }
  const dir = path.join(process.cwd(), ".data", "uploads", folder);
  await fs.mkdir(dir, { recursive: true });
  const dest = path.join(dir, `${prefix}-${safeUploadName(file.name)}`);
  await fs.writeFile(dest, Buffer.from(await file.arrayBuffer()));
  return file.name;
}

function uploadsRoot() {
  return path.resolve(process.cwd(), ".data", "uploads");
}

function isInside(root: string, target: string) {
  const relative = path.relative(root, target);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function resolveUploadDir(reference: string) {
  if (!reference || reference.includes("..")) return null;
  const segments = reference.replace(/\\/g, "/").split("/").filter(Boolean);
  if (!segments.length || segments.some((part) => part === "." || part.includes(".."))) return null;
  const dir = path.resolve(uploadsRoot(), ...segments);
  if (!isInside(uploadsRoot(), dir) && dir !== uploadsRoot()) return null;
  return dir;
}

export function contentTypeForFileName(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".doc") return "application/msword";
  if (ext === ".docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "application/octet-stream";
}

export async function resolveOrderUpload(
  reference: string,
  kind: string,
  originalName?: string,
) {
  const dir = resolveUploadDir(reference);
  if (!dir) return null;

  if (originalName) {
    const candidate = path.resolve(dir, `${kind}-${safeUploadName(originalName)}`);
    if (isInside(uploadsRoot(), candidate)) {
      try {
        await fs.access(candidate);
        return candidate;
      } catch {
        // Fall through to a prefix scan for older or renamed files.
      }
    }
  }

  try {
    const files = await fs.readdir(dir);
    const match = files.find((file) => file.startsWith(`${kind}-`));
    if (!match) return null;
    const found = path.resolve(dir, match);
    return isInside(uploadsRoot(), found) ? found : null;
  } catch {
    return null;
  }
}

export async function saveNamedOrderUpload(folder: string, storedName: string, file: File | null) {
  if (!file || file.size === 0) return "";
  if (file.size > maxBytes) {
    throw new Error(`${file.name} is larger than 8MB.`);
  }
  const safe = storedName.replace(/[^\w.\-]+/g, "_").slice(0, 120) || "file";
  const dir = path.join(process.cwd(), ".data", "uploads", folder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, safe), Buffer.from(await file.arrayBuffer()));
  return safe;
}

export async function saveJobLogo(jobId: string, file: File | null) {
  if (!jobId || jobId.includes("..") || /[\\/]/.test(jobId)) return "";
  return saveOrderUpload(`jobs/${jobId}`, "logo", file);
}

export async function resolveJobLogo(jobId: string, originalName?: string) {
  if (!jobId || jobId.includes("..") || /[\\/]/.test(jobId)) return null;
  return resolveOrderUpload(`jobs/${jobId}`, "logo", originalName);
}

export async function resolveStoredUpload(reference: string, storedName?: string) {
  if (!reference || !storedName) return null;
  if (reference.includes("..") || storedName.includes("..") || /[\\/]/.test(reference) || /[\\/]/.test(storedName)) {
    return null;
  }
  const filePath = path.resolve(uploadsRoot(), reference, storedName);
  if (!isInside(uploadsRoot(), filePath)) return null;
  try {
    await fs.access(filePath);
    return filePath;
  } catch {
    return null;
  }
}
