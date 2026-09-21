import { createHash } from "node:crypto";
import { createAnonClient } from "@/lib/supabase/anon";
import type { AdminJob, AdminStore, PackageService } from "@/lib/admin/types";
import type { PackageTurnaround } from "@/lib/packages";

export type PublicSiteState = {
  jobs: AdminJob[];
  unpublishedJobIds: string[];
  packageServices?: PackageService[];
  packageServiceMap?: Record<string, string[]>;
  packageMeta?: Record<string, PackageTurnaround>;
  updatedAt: string;
};

function publishKey() {
  const material = `${process.env.ADMIN_EMAIL ?? "info@creative-cv.co.za"}:${process.env.ADMIN_PASSWORD ?? ""}`;
  return createHash("sha256").update(`creative-cv-site-sync:${material}`).digest("hex");
}

export function publicSiteSlice(store: AdminStore): PublicSiteState {
  return {
    jobs: store.jobs ?? [],
    unpublishedJobIds: store.unpublishedJobIds ?? [],
    packageServices: store.packageServices,
    packageServiceMap: store.packageServiceMap,
    packageMeta: store.packageMeta,
    updatedAt: store.publicUpdatedAt || new Date().toISOString(),
  };
}

export function applyPublicSiteSlice(store: AdminStore, remote: PublicSiteState): AdminStore {
  return {
    ...store,
    jobs: remote.jobs ?? store.jobs,
    unpublishedJobIds: remote.unpublishedJobIds ?? store.unpublishedJobIds,
    packageServices: remote.packageServices ?? store.packageServices,
    packageServiceMap: remote.packageServiceMap ?? store.packageServiceMap,
    packageMeta: remote.packageMeta ?? store.packageMeta,
    publicUpdatedAt: remote.updatedAt || store.publicUpdatedAt,
  };
}

function asPublicSiteState(data: unknown): PublicSiteState | null {
  let value = data;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const payload = value as Partial<PublicSiteState>;
  return {
    jobs: Array.isArray(payload.jobs) ? payload.jobs : [],
    unpublishedJobIds: Array.isArray(payload.unpublishedJobIds) ? payload.unpublishedJobIds : [],
    packageServices: payload.packageServices,
    packageServiceMap: payload.packageServiceMap,
    packageMeta: payload.packageMeta,
    updatedAt: typeof payload.updatedAt === "string" ? payload.updatedAt : "",
  };
}

export function pickLivePublicSlice(store: AdminStore, remote: PublicSiteState | null): PublicSiteState {
  const local = publicSiteSlice(store);
  if (!remote) return local;
  const localAt = Date.parse(store.publicUpdatedAt ?? "") || 0;
  const remoteAt = Date.parse(remote.updatedAt ?? "") || 0;
  return localAt > remoteAt ? local : remote;
}

export async function loadPublicSite(): Promise<PublicSiteState | null> {
  const supabase = createAnonClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.rpc("get_site_catalog");
    if (error || data == null) return null;
    return asPublicSiteState(data);
  } catch {
    return null;
  }
}

export async function publishPublicSite(store: AdminStore) {
  const supabase = createAnonClient();
  if (!supabase) return true;
  try {
    const { error } = await supabase.rpc("set_site_catalog", {
      payload: publicSiteSlice(store),
      publish_key: publishKey(),
    });
    if (error) {
      console.error("Could not publish site catalog", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Could not publish site catalog", error instanceof Error ? error.message : "unknown error");
    return false;
  }
}
