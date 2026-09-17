import { promises as fs } from "node:fs";
import path from "node:path";

const maxBytes = 8 * 1024 * 1024;

export type OrderUploadKind = "photo" | "cv" | "extra";

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
  kind: OrderUploadKind,
  originalName?: string,
) {
  if (!reference || reference.includes("..") || /[\\/]/.test(reference)) return null;
  const dir = path.resolve(uploadsRoot(), reference);
  if (!isInside(uploadsRoot(), dir) && dir !== uploadsRoot()) return null;

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
