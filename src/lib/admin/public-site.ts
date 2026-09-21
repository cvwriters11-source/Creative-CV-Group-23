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
    updatedAt: new Date().toISOString(),
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
  };
}

export async function loadPublicSite(): Promise<PublicSiteState | null> {
  const supabase = createAnonClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.rpc("get_site_catalog");
    if (error || !data) return null;
    const payload = data as PublicSiteState;
    if (!payload || typeof payload !== "object") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function publishPublicSite(store: AdminStore) {
  const supabase = createAnonClient();
  if (!supabase) return;
  try {
    const { error } = await supabase.rpc("set_site_catalog", {
      payload: publicSiteSlice(store),
      publish_key: publishKey(),
    });
    if (error) {
      console.error("Could not publish site catalog", error.message);
    }
  } catch (error) {
    console.error("Could not publish site catalog", error instanceof Error ? error.message : "unknown error");
  }
}
